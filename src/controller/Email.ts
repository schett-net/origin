import { Context } from "@snek-at/function";
import { GraphQLError } from "graphql";

import { sqIAM } from "../clients/iam/src";
import { ExternalCredential } from "../clients/iam/src/schema.generated";

interface EmailConfig {
  id: string;
  isEnabled: boolean;
  externalCredential?: {
    smtp?: ExternalCredential["smtp"] | null;
    oauth?: ExternalCredential["oauth"] | null;
  };
}

export class UserEmail {
  id: string;
  emailAddress: string;
  isPrimary: boolean;
  config?: EmailConfig;

  constructor(data: {
    id: string;
    emailAddress: string;
    isPrimary: boolean;
    config?: UserEmail["config"];
  }) {
    for (const key in data) {
      this[key] = data[key];
    }
  }

  static mail = (context: Context) => async (id: string, userId: string) => {
    // Query the user email from iam

    const [emails, errors] = await sqIAM.query(
      (Query) => {
        const user = Query.user({ id: userId });

        const emails = user.emails.map((email) => ({
          id: email.id,
          emailAddress: email.emailAddress,
          isPrimary: email.isPrimary,
          config: email.config
            ? {
                id: email.config?.id,
                isEnabled: email.config?.isEnabled,
                externalCredential: {
                  smtp: email.config?.externalCredential?.smtp || undefined,
                  oauth: email.config?.externalCredential?.oauth || undefined,
                },
              }
            : undefined,
        }));

        return emails;
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

    const emailId = emails.find((email) => email.id === id);

    if (!emailId)
      throw new GraphQLError("Email not found", {
        extensions: {
          code: "EMAIL_NOT_FOUND",
        },
      });

    return new UserEmail(emailId);
  };

  static mails = (context: Context) => async (userId: string) => {
    // Query the user emails from iam

    const [data, errors] = await sqIAM.query(
      (Query) => {
        const user = Query.user({ id: userId });

        return user.emails.map((email) => ({
          id: email.id,
          emailAddress: email.emailAddress,
          isPrimary: email.isPrimary,
          config: email.config
            ? {
                id: email.config?.id,
                isEnabled: email.config?.isEnabled,
                externalCredential: {
                  smtp: email.config?.externalCredential?.smtp || undefined,
                  oauth: email.config?.externalCredential?.oauth || undefined,
                },
              }
            : undefined,
        }));
      },
      {
        headers: {
          Authorization: context.req.headers.authorization,
        },
      }
    );

    console.log(`data: ${JSON.stringify(data)}`);

    if (errors) {
      throw new GraphQLError(errors[0].message, {
        extensions: errors[0].extensions,
      });
    }

    const rtn = data.map((email) => new UserEmail(email));

    return rtn;
  };

  static create =
    (context: Context) =>
    async (
      userId: string,
      values: {
        emailAddress: UserEmail["emailAddress"];
        isPrimary?: UserEmail["isPrimary"];
        config?: {
          isEnabled?: EmailConfig["isEnabled"];
          externalCredentialId: string;
        };
      }
    ) => {
      const [data, errors] = await sqIAM.mutate(
        (Mutation) => {
          return Mutation.userEmailCreate({
            userId,
            emailAddress: values.emailAddress,
            isPrimary: values.isPrimary,
            config: values.config,
          }).id;
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

      return UserEmail.mail(context)(data, userId);
    };

  static update =
    (context: Context) =>
    async (
      emailId: string,
      userId: string,
      data: {
        emailAddress?: UserEmail["emailAddress"];
        isPrimary?: UserEmail["isPrimary"];
        config?: {
          isEnabled?: EmailConfig["isEnabled"];
          externalCredentialId: string;
        };
      }
    ) => {
      const [updatedEmailId, errors] = await sqIAM.mutate(
        (Mutation) => {
          return Mutation.userEmailUpdate({
            emailId,
            userId,
            values: data,
          }).id;
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

      return UserEmail.mail(context)(updatedEmailId, userId);
    };

  static delete =
    (context: Context) => async (emailId: string, userId: string) => {
      const [deleteOk, errors] = await sqIAM.mutate(
        (Mutation) => {
          return Mutation.userEmailDelete({ emailId, userId });
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

      return deleteOk;
    };
}
