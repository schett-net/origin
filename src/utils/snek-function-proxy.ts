import { Context, ServiceError, logger } from "@snek-at/function";
import {
  parse,
  print,
  DocumentNode,
  SelectionSetNode,
  FieldNode,
  OperationDefinitionNode,
  Kind,
} from "graphql";
import { SfProxyError } from "../errors";
import { requireAnyAuth } from "@snek-functions/jwt";

const buildSplitQuery = (
  query: string,
  options: {
    operationType?: "query" | "mutation";
    path: string;
    args?: Record<
      string,
      {
        kind: string;
        value: string;
      } | null
    >;
    excludePaths?: string[];
    addFields?: string[];
    operationName: string;
    remoteFieldName?: string;
  }
) => {
  const {
    path,
    args = {},
    addFields = [],
    excludePaths = [],
    operationName,
    remoteFieldName,
  } = options;

  const document = parse(query);
  const operation = document.definitions[0] as OperationDefinitionNode;

  // find the selection set at the end of path, e.g. "user.posts" (include only the variables that are needed)
  const pathArray = path.split(".");

  let innerField = operation as FieldNode;

  let allArgument: string[] = [];

  for (const pathElement of pathArray) {
    const field = innerField?.selectionSet?.selections.find(
      (selection) => (selection as FieldNode).name.value === pathElement
    ) as FieldNode;

    if (!field) {
      continue;
    }

    if (field.kind == "Field") {
      // skip for last path
      if (field.name.value !== pathArray[pathArray.length - 1]) {
        const argument = field.arguments?.map((arg) => arg.name.value);

        allArgument = allArgument.concat(...(argument || []));
      }
    }

    innerField = field;
  }

  for (const excludePath of excludePaths) {
    // Go to the end of the exclude path and remove the selection set
    const excludePathArray = excludePath.split(".");

    let excludeInnerField = operation as FieldNode;

    for (const pathElement of excludePathArray) {
      const field = excludeInnerField?.selectionSet?.selections.find(
        (selection) => (selection as FieldNode).name.value === pathElement
      ) as FieldNode;

      if (field) {
        // skip for last path
        if (
          field.name.value === excludePathArray[excludePathArray.length - 1]
        ) {
          continue;
        }

        excludeInnerField = field;
      }
    }

    // Remove the last pathElement from the selection set
    const selectionSet = excludeInnerField.selectionSet as SelectionSetNode;

    const selections = selectionSet.selections.filter(
      (selection) =>
        (selection as FieldNode).name.value !==
        excludePathArray[excludePathArray.length - 1]
    );

    // Remove arguments from the selection set
    const argument = excludeInnerField.arguments?.map(
      (arg) => arg.name.value
    ) as string[];

    allArgument = argument.filter((arg) => !allArgument.includes(arg));

    excludeInnerField.selectionSet = {
      kind: "SelectionSet",
      selections,
    };
  }

  for (const addField of addFields) {
    const addFieldArray = addField.split(".");

    let addInnerField = operation as FieldNode;

    for (const pathElement of addFieldArray) {
      const field = addInnerField?.selectionSet?.selections.find(
        (selection) => (selection as FieldNode).name.value === pathElement
      ) as FieldNode;

      if (field) {
        // skip for last path
        if (field.name.value === addFieldArray[addFieldArray.length - 1]) {
          continue;
        }

        addInnerField = field;
      }
    }

    // Add the last pathElement to the selection set
    const selectionSet = addInnerField.selectionSet as SelectionSetNode;

    const selections = selectionSet.selections.filter(
      (selection) =>
        (selection as FieldNode).name.value !==
        addFieldArray[addFieldArray.length - 1]
    );

    selections.push({
      kind: Kind.FIELD,
      name: {
        kind: Kind.NAME,
        value: addFieldArray[addFieldArray.length - 1],
      },
    });

    addInnerField.selectionSet = {
      kind: "SelectionSet",
      selections,
    };
  }

  // Remove variables that are not needed
  const variables = operation.variableDefinitions?.filter(
    (variable) => !allArgument.includes(variable.variable.name.value)
  );

  // make sure the inner field contains subfields

  // if (!innerField.selectionSet || !innerField.selectionSet.selections.length) {
  //   throw new Error("No subfields found");
  // }

  if (remoteFieldName) {
    innerField.name.value = remoteFieldName;
  }

  // Add arguments to the inner field
  for (const [key, value] of Object.entries(args)) {
    if (value === null) {
      // Remove the argument from the selection set
      innerField.arguments = innerField.arguments?.filter(
        (arg) => arg.name.value !== key
      );
    } else {
      innerField.arguments?.push({
        kind: "Argument",
        name: {
          kind: "Name",
          value: key,
        },
        value,
      });
    }
  }

  // create new document with the new selection set
  const newDocument = {
    kind: "Document",
    definitions: [
      {
        ...operation,
        operation: options.operationType || operation.operation,
        variableDefinitions: variables,
        name: {
          kind: "Name",
          value: operationName,
        },
        selectionSet: {
          kind: "SelectionSet",
          selections: [innerField],
        },
      },
    ],
  } as DocumentNode;

  return print(newDocument);
};

export const sfProxy = async <T>(args: {
  context: Context;
  endpoint:
    | {
        development: string;
        production: string;
      }
    | string;
  splitter: {
    operationType?: "query" | "mutation";
    path: string;
    args?: Record<
      string,
      {
        kind: string;
        value: string;
      } | null
    >;
    addFields?: string[];
    excludePaths?: string[];
    operationName: string;
    remoteFieldName?: string;
  };
  headers?: Record<string, string>;
  returnNullOnErrors?: boolean;
  returnNullOnSplitterErrors?: boolean;
}): Promise<T> => {
  const {
    context,
    endpoint,
    splitter,
    headers,
    returnNullOnErrors,
    returnNullOnSplitterErrors,
  } = args;

  const { req } = context;

  const { body } = req;

  const { query, variables } = body;

  let splitQuery: string;

  try {
    splitQuery = buildSplitQuery(query, splitter);
    console.log(splitQuery);
  } catch (err) {
    if (returnNullOnErrors || returnNullOnSplitterErrors) {
      return null as T;
    }

    throw new SfProxyError(err, { query, variables, splitQuery: null });
  }

  logger.info(
    `Sending request to ${endpoint} with ${splitQuery} and ${variables}`
  );

  const endpointString =
    typeof endpoint === "string"
      ? endpoint
      : process.env.NODE_ENV === "production"
      ? endpoint.production
      : endpoint.development;

  const requestHeaders = new Headers({
    "Content-Type": "application/json",
    ...headers,
  });

  if (context.req.headers.authorization) {
    requestHeaders.set("Authorization", context.req.headers.authorization);

    try {
      const newContext = await requireAnyAuth(context, []);

      const auth = newContext.multiAuth[0];

      if (auth) {
        requestHeaders.set("x-forwarded-user", auth.userId);
        requestHeaders.set("x-forwarded-resource", auth.resourceId);
      }
    } catch (error) {
      throw new ServiceError(error.message, error.extensions);
    }
  }

  const response = await fetch(endpointString, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify({
      query: splitQuery,
      variables,
    }),
  });

  const { data, errors } = await response.json();

  if (errors) {
    if (returnNullOnErrors) {
      return null as T;
    }

    throw new SfProxyError(errors[0], {
      query,
      splitQuery,
      variables,
    });
  }

  const firstPath =
    splitter.remoteFieldName ||
    splitter.path.split(".")[splitter.path.split(".").length - 1];

  return data[firstPath];
};
