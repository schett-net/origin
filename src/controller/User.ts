import { Context } from "@snek-at/function";
import {
  sq as sqJWT,
  anyLoginRequired,
  AuthenticationContext,
  loginRequired,
} from "@snek-functions/jwt";
import { GraphQLError } from "graphql";
import { sqAuthentication } from "../clients/authentication";

import { sqIAM } from "../clients/iam";
import { Mutation } from "../clients/iam/schema.generated";
import { ACCESS_RESOURCE_ID } from "../constants";
import { AuthenticationFailedError } from "../errors";
import { tokenCreate, tokenRefresh } from "../utils/token";
import { Resource } from "./Resource";

type RegisterInput = Parameters<Mutation["userCreate"]>[0];

export class User {
  static user = (context: Context) => async (id: string) => {
    const [data, errors] = await sqIAM.query(
      (Query) => {
        const u = Query.user({ id });

        return {
          id: u.id,
          username: u.username,
          primaryEmailAddress: u.primaryEmail.emailAddress,
          emailAddresses: u.emails.map((e) => e.emailAddress),
          resourceId: u.resourceId,
          isAdmin: u.isAdmin,
        };
      },
      {
        headers: {
          Authorization: context.req.headers.authorization || "",
        },
      }
    );

    if (errors) {
      throw new GraphQLError(errors[0].message, {
        extensions: errors[0].extensions,
      });
    }

    return new User(context, data);
  };

  static register =
    (context: Context) =>
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
        user: () => User.user(context)(userId),
        accessToken,
      };
    };

  static me = (context: Context) => async (resourceId?: string) => {
    let authenticationInfo = await anyLoginRequired(context);

    if (resourceId) {
      authenticationInfo = authenticationInfo.filter(
        (authenticationInfo) =>
          authenticationInfo.authenticationInfo.resourceId === resourceId
      );
    }

    return Promise.all(
      authenticationInfo.map(async ({ authenticationInfo }) => {
        const [data, errors] = await sqIAM.query(
          (User) => {
            const u = User.user({ id: authenticationInfo.userId });

            return {
              id: u.id,
              username: u.username,
              primaryEmailAddress: u.primaryEmail.emailAddress,
              emailAddresses: u.emails.map((e) => e.emailAddress),
              resourceId: u.resourceId,
              isAdmin: u.isAdmin,
            };
          },
          {
            headers: {
              Authorization: context.req.headers.authorization || "",
            },
          }
        );

        if (errors) {
          throw new GraphQLError(errors[0].message, {
            extensions: errors[0].extensions,
          });
        }

        return new User(context, data);
      })
    );
  };

  static signIn =
    (context: Context) =>
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
      const user = await User.user(context)(userId);

      console.log("user", user);

      const scope: any = {};

      if (user.isAdmin) {
        scope.admin = ["*"];
      }

      // Create privileged access token
      const tokenPair = await tokenCreate(userId, resourceId, scope);

      // override context authorization
      context.req.headers["authorization"] = `Bearer ${tokenPair.accessToken}`;

      const userWithUpdatedCtx = new User(context, {
        id: user.id,
        username: user.username,
        primaryEmailAddress: user.primaryEmailAddress,
        emailAddresses: user.emailAddresses,
        resourceId: user.resourceId,
        isAdmin: user.isAdmin,
      });

      return {
        tokenPair: tokenPair,
        user: userWithUpdatedCtx,
        me: () => User.me(context),
      };
    };

  static signOut = (context: Context) => (resourceId?: string) => {
    throw new Error("Not implemented yet");
  };

  static refresh =
    (context: Context) => async (accessToken: string, refreshToken: string) => {
      const tokenPair = await tokenRefresh({
        accessToken,
        refreshToken,
      });

      // override context authorization
      context.req.headers["authorization"] = `Bearer ${tokenPair.accessToken}`;

      return {
        tokenPair,
        me: () => User.me(context)(),
      };
    };

  static ssoSignIn = (context: Context) => async (resourceId: string) => {
    const { authenticationInfo } = await loginRequired(context, [
      ACCESS_RESOURCE_ID,
    ]);

    const [usersUnderSameAccount, errors] = await sqIAM.query(
      (Query) => {
        return (
          Query.user({ id: authenticationInfo.userId }).account?.users.map(
            (u) => {
              return {
                userId: u.id,
                resourceId: u.resourceId,
              };
            }
          ) ?? []
        );
      },
      {
        headers: {
          Authorization: context.req.headers.authorization || "",
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
      context.req.headers["authorization"] = `Bearer ${tokenPair.accessToken}`;

      return {
        tokenPair: tokenPair,
        user: () => User.user(context)(ssoUser.userId),
        me: () => User.me(context)(),
      };
    }

    throw new AuthenticationFailedError();
  };

  #context: Context;

  id: string;
  username: string;
  primaryEmailAddress: string;
  emailAddresses: string[];
  isAdmin: boolean;

  private resourceId: string;

  constructor(
    context: Context,
    data: {
      id: string;
      username: string;
      primaryEmailAddress: string;
      emailAddresses: string[];
      resourceId: string;
      isAdmin: boolean;
    }
  ) {
    this.#context = context;

    for (const key in data) {
      this[key] = data[key];
    }
  }

  resource = async () => Resource.resource(this.#context)(this.resourceId);
}
