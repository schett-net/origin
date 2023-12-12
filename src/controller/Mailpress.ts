import { Request, withContext } from "@snek-at/function";
import { GraphQLError } from "graphql";

import {
  DataInput,
  DataInput_1,
  Mutation,
  Query,
} from "../clients/mailpress/src/schema.generated";
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

  static template = withContext((context) => async (id: string) => {
    const res = await sfProxy<ReturnType<Query["template"]>>({
      context,
      endpoint: apiURL,
      splitter: {
        path: "mailpressTemplate",
        remoteFieldName: "template",
        excludePaths: [],
        operationName: "Template",
      },
    });

    return res;
  });

  static allTemplate = withContext((context) => async () => {
    const res = await sfProxy<Query["allTemplate"]>({
      context,
      endpoint: apiURL,
      splitter: {
        path: "mailpressAllTemplate",
        remoteFieldName: "allTemplate",
        excludePaths: [],
        operationName: "Templates",
      },
    });

    return res;
  });

  static templateCreate = withContext((context) => async (data: DataInput) => {
    const res = await sfProxy<ReturnType<Mutation["templateCreate"]>>({
      context,
      endpoint: apiURL,
      splitter: {
        path: "mailpressTemplateCreate",
        remoteFieldName: "templateCreate",
        excludePaths: [],
        operationName: "TemplateCreate",
      },
    });

    return res;
  });

  static templateUpdate = withContext(
    (context) => async (id: string, data: DataInput_1) => {
      const res = await sfProxy<ReturnType<Mutation["templateUpdate"]>>({
        context,
        endpoint: apiURL,
        splitter: {
          path: "mailpressTemplateUpdate",
          remoteFieldName: "templateUpdate",
          excludePaths: [],
          operationName: "TemplateUpdate",
        },
      });

      return res;
    }
  );

  static templateDelete = withContext((context) => async (id: string) => {
    const res = await sfProxy<ReturnType<Mutation["templateDelete"]>>({
      context,
      endpoint: apiURL,
      splitter: {
        path: "mailpressTemplateDelete",
        remoteFieldName: "templateDelete",
        excludePaths: [],
        operationName: "TemplateDelete",
      },
    });

    return res;
  });
}
