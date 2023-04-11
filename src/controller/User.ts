import { Context, bindWithContext, withContext } from "@snek-at/function";
import {
  sq as sqJWT,
  AuthenticationContext,
  requireAnyAuth,
  requireUserAuth,
} from "@snek-functions/jwt";
import { GraphQLError } from "graphql";
import { sqAuthentication } from "../clients/authentication/src";

import { sqIAM } from "../clients/iam/src";
import { Mutation, User as IAMUser } from "../clients/iam/src/schema.generated";
import { ACCESS_RESOURCE_ID } from "../constants";
import { AuthenticationFailedError } from "../errors";
import { tokenCreate, tokenRefresh } from "../utils/token";
import { Resource } from "./Resource";
import { UserEmail } from "./Email";

type RegisterInput = Parameters<Mutation["userCreate"]>[0];

type UserEmailCreateInput = Parameters<Mutation["userEmailCreate"]>[0];
type UserEmailDeleteInput = Parameters<Mutation["userEmailDelete"]>[0];
type UserEmailUpdateInput = Parameters<Mutation["userEmailUpdate"]>[0];

export class User {
  static user = withContext((context) => async (id: string) => {
    const [data, errors] = await sqIAM.query(
      (Query) => {
        const u = Query.user({ id });

        return {
          id: u.id,
          username: u.username,
          primaryEmailAddress: u.primaryEmail.emailAddress,
          resourceId: u.resourceId,
          isAdmin: u.isAdmin,
        };
      },
      {
        headers: {
          Authorization: context.req.headers.authorization,
        },
      }
    );

    if (errors) {
      throw new GraphQLError(errors[0].message, {
        extensions: errors[0].extensions,
      });
    }

    return new User(context, data);
  });

  static register = withContext(
    (context) =>
      async (
        resourceId: RegisterInput["resourceId"],
        values: RegisterInput["values"],
        skipEmailVerification?: RegisterInput["skipEmailVerification"]
      ) => {
        const [{ userId, accessToken }, errors] = await sqIAM.mutate(
          (Mutation) => {
            const u = Mutation.userCreate({
              resourceId,
              values,
              skipEmailVerification: skipEmailVerification || false,
            });

            return {
              userId: u.user.id,
              accessToken: u.accessToken,
            };
          },
          {
            headers: {
              Authorization: context.req.headers.authorization,
            },
          }
        );

        if (errors) {
          throw new GraphQLError(errors[0].message, {
            extensions: errors[0].extensions,
          });
        }

        return {
          user: () => bindWithContext(context, User.user)(userId),
          accessToken,
        };
      }
  );

  static me = withContext(
    (context) => async () => {
      const userId = context.multiAuth[0].userId;

      return bindWithContext(context, User.user)(userId);
    },
    {
      decorators: [requireAnyAuth],
    }
  );

  static signIn = withContext(
    (context) =>
      async (login: string, password: string, resourceId: string) => {
        const [userId, errors] = await sqAuthentication.mutate(
          (Mutation) =>
            Mutation.userAuthenticate({ login, password, resourceId })?.userId
        );

        if (errors) {
          throw new AuthenticationFailedError();
        }

        const unprivilegedTokenPair = await tokenCreate(userId, resourceId);

        // override context authorization
        context.req.headers[
          "authorization"
        ] = `Bearer ${unprivilegedTokenPair.accessToken}`;

        console.log("context.req.headers", context.req.headers);

        // Get user to determine permissions
        const user = await bindWithContext(context, User.user)(userId);

        console.log("user", user);

        const scope: any = {};

        if (user.isAdmin) {
          scope.admin = ["*"];
        }

        // Create privileged access token
        const tokenPair = await tokenCreate(userId, resourceId, scope);

        // override context authorization
        context.req.headers[
          "authorization"
        ] = `Bearer ${tokenPair.accessToken}`;

        const userWithUpdatedCtx = new User(context, {
          id: user.id,
          username: user.username,
          primaryEmailAddress: user.primaryEmailAddress,
          resourceId: user.resourceId,
          isAdmin: user.isAdmin,
        });

        return {
          tokenPair: tokenPair,
          user: userWithUpdatedCtx,
          me: () => bindWithContext(context, User.me)(),
        };
      }
  );

  static signOut = withContext((context) => (resourceId?: string) => {
    throw new Error("Not implemented yet");
  });

  static refresh = withContext(
    (context) => async (accessToken: string, refreshToken: string) => {
      const tokenPair = await tokenRefresh({
        accessToken,
        refreshToken,
      });

      // override context authorization
      context.req.headers["authorization"] = `Bearer ${tokenPair.accessToken}`;

      return {
        tokenPair,
        me: () => bindWithContext(context, User.me)(),
      };
    }
  );

  static ssoSignIn = withContext(
    (context) => async (resourceId: string) => {
      const userId = context.multiAuth[0].userId;

      const [usersUnderSameAccount, errors] = await sqIAM.query(
        (Query) => {
          return (
            Query.user({ id: userId }).account?.users.map((u) => {
              return {
                userId: u.id,
                resourceId: u.resourceId,
              };
            }) ?? []
          );
        },
        {
          headers: {
            Authorization: context.req.headers.authorization,
          },
        }
      );

      if (errors) {
        throw new GraphQLError(errors[0].message, {
          extensions: errors[0].extensions,
        });
      }

      const ssoUser = usersUnderSameAccount.find(
        (u) => u.resourceId === resourceId
      );

      if (ssoUser) {
        const tokenPair = await tokenCreate(ssoUser.userId, resourceId);

        // override context authorization
        context.req.headers[
          "authorization"
        ] = `Bearer ${tokenPair.accessToken}`;

        return {
          tokenPair: tokenPair,
          user: () => bindWithContext(context, User.user)(ssoUser.userId),
          me: () => bindWithContext(context, User.me)(),
        };
      }

      throw new AuthenticationFailedError();
    },
    {
      decorators: [requireUserAuth],
    }
  );

  static emailCreate = withContext(
    (context) =>
      async (
        emailAddress: UserEmailCreateInput["emailAddress"],
        isPrimary: UserEmailCreateInput["isPrimary"],
        emailConfiguration: UserEmailCreateInput["emailConfiguration"]
      ) => {
        const userId = context.multiAuth[0].userId;

        return await UserEmail.create(context)(userId, {
          emailAddress,
          isPrimary,
          emailConfiguration,
        });
      },
    {
      decorators: [requireAnyAuth],
    }
  );

  static emailUpdate = withContext(
    (context) =>
      async (
        emailId: UserEmailUpdateInput["emailId"],
        values: UserEmailUpdateInput["values"]
      ) => {
        const userId = context.multiAuth[0].userId;

        return await UserEmail.update(context)(emailId, userId, values);
      },
    {
      decorators: [requireAnyAuth],
    }
  );

  static emailDelete = withContext(
    (context) => async (emailId: string) => {
      const userId = context.multiAuth[0].userId;

      return await UserEmail.delete(context)(emailId, userId);
    },
    {
      decorators: [requireAnyAuth],
    }
  );

  #context: Context;

  id: string;
  username: string;
  primaryEmailAddress: string;
  isAdmin: boolean;

  private resourceId: string;

  constructor(
    context: Context,
    data: {
      id: string;
      username: string;
      primaryEmailAddress: string;
      resourceId: string;
      isAdmin: boolean;
    }
  ) {
    this.#context = context;

    for (const key in data) {
      this[key] = data[key];
    }
  }

  resource = async () =>
    bindWithContext(this.#context, Resource.resource)(this.resourceId);

  emails = async () => UserEmail.mails(this.#context)(this.id);
}
