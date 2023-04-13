import { Context } from "@snek-at/function";
import { GraphQLError } from "graphql";

import { sqIAM } from "../clients/iam/src";

export class UserEmail {
  id: string;
  emailAddress: string;
  isPrimary: boolean;
  emailConfiguration?: {
    smtpHost: string;
    smtpPort: number;
    secure: boolean;
    username: string;
    password: string;
    isEnabled: boolean;
  };

  constructor(data: {
    id: string;
    emailAddress: string;
    isPrimary: boolean;
    emailConfiguration?: UserEmail["emailConfiguration"];
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
          emailConfiguration: email.emailConfiguration
            ? {
                smtpHost: email.emailConfiguration?.smtpHost,
                smtpPort: email.emailConfiguration?.smtpPort,
                secure: email.emailConfiguration?.secure,
                username: email.emailConfiguration?.username,
                password: email.emailConfiguration?.password,
                isEnabled: email.emailConfiguration?.isEnabled,
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
          emailConfiguration: email.emailConfiguration
            ? {
                smtpHost: email.emailConfiguration.smtpHost,
                smtpPort: email.emailConfiguration.smtpPort,
                secure: email.emailConfiguration.secure,
                username: email.emailConfiguration.username,
                password: email.emailConfiguration.password,
                isEnabled: email.emailConfiguration.isEnabled,
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

    if (errors) {
      throw new GraphQLError(errors[0].message, {
        extensions: errors[0].extensions,
      });
    }

    return data.map((email) => new UserEmail(email));
  };

  static create =
    (context: Context) =>
    async (
      userId: string,
      values: {
        emailAddress: UserEmail["emailAddress"];
        isPrimary?: UserEmail["isPrimary"];
        emailConfiguration?: UserEmail["emailConfiguration"];
      }
    ) => {
      const [data, errors] = await sqIAM.mutate(
        (Mutation) => {
          return Mutation.userEmailCreate({
            userId,
            emailAddress: values.emailAddress,
            isPrimary: values.isPrimary,
            emailConfiguration: values.emailConfiguration,
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
        emailConfiguration?: UserEmail["emailConfiguration"];
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
