import { withContext } from "@snek-at/function";
import { GraphQLError } from "graphql";

import { Mutation } from "../clients/mailpress/src/schema.generated";

type MailScheduleArgs = Parameters<Mutation["mailSchedule"]>[0];
type MailScheduleResult = ReturnType<Mutation["mailSchedule"]>;

const apiURL =
  process.env.NODE_ENV === "production"
    ? "http://mailpress:3000/graphql"
    : "https://services.snek.at/mailpress/graphql";

export class Mailpress {
  static mailSchedule = withContext<
    (
      envelope: MailScheduleArgs["envelope"],
      body: MailScheduleArgs["body"],
      template: MailScheduleArgs["template"]
    ) => Promise<MailScheduleResult>
  >((context) => async () => {
    const requestBodyFromReq = context.req.body;

    const query = requestBodyFromReq.query.replace(
      "mailpressMailSchedule",
      "mailSchedule"
    );

    const variables = requestBodyFromReq.variables;

    const headers = new Headers({
      "Content-Type": "application/json",
    });

    if (context.req.headers.authorization) {
      headers.set("Authorization", context.req.headers.authorization);
    }

    const data = await fetch(apiURL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const json = await data.json();

    if (json.errors) {
      throw new GraphQLError(json.errors[0].message, {
        extensions: json.errors[0].extensions,
      });
    }

    return json.data.mailSchedule;
  });
}
