import { Request, withContext } from "@snek-at/function";
import { GraphQLError } from "graphql";

import { Mutation } from "../clients/mailpress/src/schema.generated";
import { sfProxy } from "../utils/snek-function-proxy";

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
      bodyHTML: MailScheduleArgs["bodyHTML"],
      template: MailScheduleArgs["template"]
    ) => Promise<MailScheduleResult>
  >((context) => async () => {
    const res = await sfProxy<MailScheduleResult>({
      context,
      endpoint: apiURL,
      splitter: {
        path: "mailpressMailSchedule",
        remoteFieldName: "mailSchedule",
        excludePaths: [],
        operationName: "MailSchedule",
      },
    });

    if (!res) {
      throw new GraphQLError("Mailpress mailSchedule failed");
    }

    return res;
  });
}
