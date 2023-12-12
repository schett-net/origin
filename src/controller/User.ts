import { ServiceError, bindWithContext, withContext } from "@snek-at/function";
import { requireAnyAuth } from "@snek-functions/jwt";
import { GraphQLError } from "graphql";
import { sqAuthentication } from "../clients/authentication/src";

import { TokenPair } from "@snek-functions/jwt/dist/schema.generated";
import { asEnumKey } from "snek-query";
import { sqIAM } from "../clients/iam/src";
import {
  FilterInput,
  Query as IAMQuery,
  Mutation,
  OAuthCredentialInput,
  OAuthProviderInput,
  SMTPCredentialInput,
} from "../clients/iam/src/schema.generated";
import {
  Query as SocialQuery,
  Mutation as SocialMutation,
} from "../clients/social/src/schema.generated";
import { AuthenticationFailedError } from "../errors";
import { sfProxy } from "../utils/snek-function-proxy";
import { tokenCreate, tokenRefresh } from "../utils/token";
import { UserEmail } from "./Email";
import { SocialController } from "./Social";

type RegisterInput = Parameters<Mutation["userCreate"]>[0];
type UserUpdateValues = Parameters<Mutation["userUpdate"]>[0]["values"];

type UserEmailCreateInput = Parameters<Mutation["userEmailCreate"]>[0];
type UserEmailConfirmInput = Parameters<Mutation["userEmailConfirm"]>[0];
type UserEmailUpdateInput = Parameters<Mutation["userEmailUpdate"]>[0];

export class UserController {
  static endpoint = {
    development: "https://services.snek.at/iam/graphql",
    production: "http://iam:3000/graphql",
  };

  static user = withContext(
    (context) =>
      async (
        resourceId: string,
        id?: string,
        login?: string
      ): Promise<
        ReturnType<IAMQuery["user"]> & {
          profile?: ReturnType<SocialQuery["profile"]>;
        }
      > => {
        const user = await sfProxy<ReturnType<IAMQuery["user"]>>({
          context,
          endpoint: UserController.endpoint,
          splitter: {
            operationName: "User",
            path: "user",
            excludePaths: ["user.profile"],
            addFields: ["user.id"],
          },
        });

        if (!user?.id) {
          throw new ServiceError("Internal Server Error", {
            code: "INTERNAL_SERVER_ERROR",
            statusCode: 500,
            message: "Internal Server Error",
          });
        }

        const profile = await sfProxy<ReturnType<SocialQuery["profile"]>>({
          context,
          endpoint: SocialController.endpoint,
          splitter: {
            operationName: "UserProfile",
            path: "user.profile",
            args: {
              resourceId: {
                kind: "StringValue",
                value: resourceId,
              },
              userId: {
                kind: "StringValue",
                value: user.id,
              },
            },
            excludePaths: [],
          },
          returnNullOnErrors: true,
        });

        const data = {
          ...user,
          profile,
        };

        return data as any;
      },
    {
      decorators: [],
    }
  );

  static allUser = withContext(
    (context) => async (resourceId: string, filter?: FilterInput) => {
      const users = await sfProxy<ReturnType<IAMQuery["allUser"]>>({
        context,
        endpoint: UserController.endpoint,
        splitter: {
          operationName: "AllUser",
          path: "allUser",
          excludePaths: [],
        },
      });

      // const profiles = await sfProxy<ReturnType<SocialQuery["allProfile"]>>({
      //   context,
      //   endpoint: SocialController.endpoint,
      //   splitter: {
      //     operationName: "AllProfile",
      //     path: "allProfile",
      //     args: {
      //       resourceId: {
      //         kind: "StringValue",
      //         value: resourceId,
      //       },
      //       filters: {
      //         kind: "FiltersInput",
      //         value: {
      //           kind: "StringArrayValue",
      //           value: users.map((u) => u.id),
      //         },
      //       } as any,
      //     },
      //     excludePaths: [],
      //   },
      // });

      // const data = users.map((u) => ({
      //   ...u,
      //   profile: profiles.nodes.find((p) => p.id === u.id),
      // }));

      return users;
    }
  );

  static userUpdate = withContext(
    (context) => async (id: string, values: UserUpdateValues) => {
      const user = await sfProxy<ReturnType<Mutation["userUpdate"]>>({
        context,
        endpoint: UserController.endpoint,
        splitter: {
          operationName: "UserUpdate",
          path: "userUpdate",
          excludePaths: [],
        },
      });

      return user;
    }
  );

  static userDelete = withContext((context) => async (id: string) => {
    const user = await sfProxy<ReturnType<Mutation["userDelete"]>>({
      context,
      endpoint: UserController.endpoint,
      splitter: {
        operationName: "UserDelete",
        path: "userDelete",
        excludePaths: [],
      },
    });

    return user;
  });

  static userMe = withContext(
    (context) => async () => {
      const userId = context.multiAuth[0].userId;
      const resourceId = context.multiAuth[0].resourceId;

      const user = await sfProxy<ReturnType<IAMQuery["user"]>>({
        context,
        endpoint: UserController.endpoint,
        splitter: {
          operationName: "User",
          path: "userMe",
          remoteFieldName: "user",
          excludePaths: [],
          args: {
            id: {
              kind: "StringValue",
              value: userId,
            },
            resourceId: {
              kind: "StringValue",
              value: resourceId,
            },
          },
        },
      });

      return user;
    },
    {
      decorators: [requireAnyAuth],
    }
  );

  static userRegister = withContext(
    (context) =>
      async (
        resourceId: RegisterInput["resourceId"],
        values: RegisterInput["values"],
        skipEmailVerification?: RegisterInput["skipEmailVerification"]
      ) => {
        return await sfProxy<ReturnType<Mutation["userCreate"]>>({
          context,
          endpoint: UserController.endpoint,
          splitter: {
            operationName: "UserCreate",
            path: "userRegister",
            remoteFieldName: "userCreate",
            excludePaths: [],
          },
        });
      }
  );

  static userCreate = withContext(
    (context) =>
      async (
        resourceId: RegisterInput["resourceId"],
        values: RegisterInput["values"],
        skipEmailVerification?: RegisterInput["skipEmailVerification"],
        createProfile?: boolean
      ) => {
        const user = await sfProxy<ReturnType<Mutation["userCreate"]>>({
          context,
          endpoint: UserController.endpoint,
          splitter: {
            operationName: "UserCreate",
            path: "userCreate",
            excludePaths: ["userCreate.profile"],
            args: {
              createProfile: null,
            },
          },
        });

        let profile: ReturnType<SocialQuery["profile"]> | null = null;

        if (createProfile) {
          profile = await sfProxy<ReturnType<SocialMutation["profileCreate"]>>({
            context,
            endpoint: SocialController.endpoint,
            splitter: {
              operationType: "mutation",
              operationName: "ProfileCreate",
              path: "userCreate.profile",
              remoteFieldName: "profileCreate",
              excludePaths: [],
              args: {
                userId: {
                  kind: "StringValue",
                  value: user.id,
                },
                values: null,
                skipEmailVerification: null,
                createProfile: null,
              },
            },
          });
        }

        return {
          ...user,
          profile,
        };
      }
  );

  static userCreateConfirm = withContext(
    (context) => async (userId: string, otp: string) => {
      return await sfProxy<ReturnType<Mutation["userCreateConfirm"]>>({
        context,
        endpoint: UserController.endpoint,
        splitter: {
          operationName: "UserCreateConfirm",
          path: "userCreateConfirm",
        },
      });
    }
  );

  static userSignIn = withContext(
    (context) =>
      async (
        login: string,
        password: string,
        resourceId: string
      ): Promise<{
        tokenPair: TokenPair;
        user: Awaited<ReturnType<typeof UserController.user>>;
      }> => {
        const [userId, authErrors] = await sqAuthentication.mutate(
          (Mutation) =>
            Mutation.userAuthenticate({ login, password, resourceId })?.userId
        );

        if (authErrors) {
          throw new AuthenticationFailedError();
        }

        const unprivilegedTokenPair = await tokenCreate(userId, resourceId);

        // override context authorization
        context.req.headers[
          "authorization"
        ] = `Bearer ${unprivilegedTokenPair.accessToken}`;

        // Get user to determine permissions
        const [auth, userErrors] = await sqIAM.query(
          (Query) => {
            const u = Query.user({ resourceId, id: userId });

            return {
              isAdmin: u.isAdmin,
              roles: u.roles,
            };
          },
          {
            headers: {
              Authorization: context.req.headers.authorization,
            },
          }
        );

        if (userErrors) {
          throw new GraphQLError(userErrors[0].message, {
            extensions: userErrors[0].extensions,
          });
        }

        const scope: any = {};
        const roles: string[] = auth.roles.map((r) => r.id);

        if (auth.isAdmin) {
          // Deprecated in favor of roles
          scope.admin = ["*"];
        }

        // Create privileged access token
        const tokenPair = await tokenCreate(userId, resourceId, {
          scope,
          roles,
        });

        // override context authorization
        context.req.headers[
          "authorization"
        ] = `Bearer ${tokenPair.accessToken}`;

        return {
          tokenPair,
          user: {
            ...(await sfProxy<ReturnType<IAMQuery["user"]>>({
              context,
              endpoint: UserController.endpoint,
              splitter: {
                operationType: "query",
                operationName: "User",
                path: "userSignIn.user",
                excludePaths: ["userSignIn.user.profile"],
                args: {
                  id: {
                    kind: "StringValue",
                    value: userId,
                  },
                  resourceId: {
                    kind: "StringValue",
                    value: resourceId,
                  },
                },
              },
            })),
            profile: await sfProxy<ReturnType<SocialQuery["profile"]>>({
              context,
              endpoint: SocialController.endpoint,
              splitter: {
                operationType: "query",
                operationName: "UserProfile",
                path: "userSignIn.user.profile",
                args: {
                  resourceId: {
                    kind: "StringValue",
                    value: resourceId,
                  },
                  userId: {
                    kind: "StringValue",
                    value: userId,
                  },
                },
                excludePaths: [],
              },
              returnNullOnErrors: true,
            }),
          },
        } as any;
      }
  );

  static passwordReset = withContext(
    (context) => async (emailAddress: string, resourceId: string) => {
      const [_, errors] = await sqIAM.mutate(
        (Mutation) => Mutation.passwordReset({ emailAddress, resourceId }),
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

      return true;
    },
    {
      decorators: [],
    }
  );

  static passwordResetConfirm = withContext(
    (context) =>
      async (
        emailAddress: string,
        resourceId: string,
        password: string,
        otp: string
      ) => {
        const [_, errors] = await sqIAM.mutate(
          (Mutation) =>
            Mutation.passwordResetConfirm({
              emailAddress,
              resourceId,
              password,
              otp,
            }),
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

        return true;
      },
    {
      decorators: [],
    }
  );

  static userSignOut = withContext((context) => (resourceId?: string) => {
    throw new Error("Not implemented yet");
  });

  static userRefresh = withContext(
    (context) => async (accessToken: string, refreshToken: string) => {
      const tokenPair = await tokenRefresh({
        accessToken,
        refreshToken,
      });

      // override context authorization
      context.req.headers["authorization"] = `Bearer ${tokenPair.accessToken}`;

      const auth = await requireAnyAuth(context, []);

      const userId = auth.multiAuth[0].userId;
      const resourceId = auth.multiAuth[0].resourceId;

      const me = await sfProxy<ReturnType<IAMQuery["user"]>>({
        context,
        endpoint: UserController.endpoint,
        splitter: {
          operationType: "query",
          operationName: "User",
          path: "userRefresh.me",
          remoteFieldName: "user",
          excludePaths: ["userRefresh.tokenPair"],
          args: {
            id: {
              kind: "StringValue",
              value: userId,
            },
            resourceId: {
              kind: "StringValue",
              value: resourceId,
            },
            refreshToken: null,
            accessToken: null,
          },
        },
        returnNullOnSplitterErrors: true,
      });

      return {
        tokenPair,
        me,
      };
    }
  );

  static emailCreate = withContext(
    (context) =>
      async (
        emailAddress: UserEmailCreateInput["emailAddress"],
        isPrimary: UserEmailCreateInput["isPrimary"],
        config: UserEmailCreateInput["config"]
      ) => {
        const userId = context.multiAuth[0].userId;

        return await UserEmail.create(context)(userId, {
          emailAddress,
          isPrimary,
          config,
        });
      },
    {
      decorators: [requireAnyAuth],
    }
  );

  static userEmailConfirmationResend = withContext(
    (context) => async (emailId: string) => {
      const userId = context.multiAuth[0].userId;

      return await UserEmail.confirmationResend(context)(emailId, userId);
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

  static externalCredentialCreate = withContext(
    (context) =>
      async (smtp?: SMTPCredentialInput, oauth?: OAuthCredentialInput) => {
        const userId = context.multiAuth[0].userId;

        const [externalCredentialId, errors] = await sqIAM.mutate(
          (Mutation) =>
            Mutation.userExternalCredentialCreate({
              userId,
              smtp,
              oauth: oauth
                ? {
                    ...oauth,
                    provider: asEnumKey(OAuthProviderInput, oauth.provider),
                  }
                : undefined,
            }).id,
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

        return externalCredentialId;
      },
    {
      decorators: [requireAnyAuth],
    }
  );

  static userTokenCreate = withContext(
    (context) => async (userId: string, name: string) => {
      return await sfProxy<ReturnType<Mutation["userTokenCreate"]>>({
        context,
        endpoint: UserController.endpoint,
        splitter: {
          operationName: "UserTokenCreate",
          path: "userTokenCreate",
          excludePaths: [],
        },
      });
    },
    {
      decorators: [],
    }
  );
}
