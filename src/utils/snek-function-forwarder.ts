import { GraphQLError } from "graphql";
import {
  graphql,
  parse,
  print,
  Kind,
  DocumentNode,
  SelectionNode,
  ASTNode,
} from "graphql";
import { Context, logger } from "@snek-at/function";
import { requireAnyAuth } from "@snek-functions/jwt";

export const forward = async <Data>(args: {
  context: Context;
  endpoint:
    | {
        development: string;
        production: string;
      }
    | string;
  name: string;
  fieldPath?: string; // Add fieldPath as an argument
  headers?: Record<string, string>;
}): Promise<Data> => {
  const { context, endpoint, name, fieldPath, headers } = args;

  const endpointString =
    typeof endpoint === "string"
      ? endpoint
      : process.env.NODE_ENV === "production"
      ? endpoint.production
      : endpoint.development;

  const requestBodyFromReq = context.req.body;

  // Parse the GraphQL query
  const parsedQuery = parse(requestBodyFromReq.query);

  // Update the starting point of the query
  const updatedQuery = updateStartingPoint(parsedQuery, fieldPath, name);

  const query = print(updatedQuery);

  console.log("query", query);

  const variables = requestBodyFromReq.variables;

  const requestHeaders = new Headers({
    "Content-Type": "application/json",
    ...headers,
  });

  if (context.req.headers.authorization) {
    requestHeaders.set("Authorization", context.req.headers.authorization);
  }

  try {
    const newContext = await requireAnyAuth(context, []);

    const auth = newContext.multiAuth[0];

    console.log("auth", auth);

    if (auth) {
      console.log("setting headers", auth);
      requestHeaders.set("x-forwarded-user", auth.userId);
      requestHeaders.set("x-forwarded-resource", auth.resourceId);
    }
  } catch (error) {
    logger.warn(
      `Authentication failed when forwarding request to ${endpointString} with ${query} and ${variables} with error ${error}`
    );
  }

  const data = await fetch(endpointString, {
    method: "POST",
    headers: requestHeaders,
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

  return json.data[name];
};

const updateStartingPoint = (
  doc: DocumentNode,
  startingPoint?: string,
  name?: string
): DocumentNode => {
  if (!startingPoint) {
    return doc;
  }

  const startingPointPath = startingPoint.split(".");

  const clonedDoc = JSON.parse(JSON.stringify(doc));

  let newSelectionSet: SelectionNode[] = [];

  const recurse = (node: ASTNode, path: string[]) => {
    const [field, ...rest] = path;

    if (node.kind === Kind.SELECTION_SET) {
      const selection = node.selections?.find(
        (selection: any) => selection.name.value === field
      );

      if (selection) {
        recurse(selection, path);
      }
    } else if (node.kind === Kind.FIELD) {
      const selectionSet = node.selectionSet;

      if (rest && rest.length === 0) {
        newSelectionSet = [node];

        return;
      }

      if (selectionSet) {
        recurse(selectionSet, rest);
      }
    }
  };

  recurse(clonedDoc.definitions[0].selectionSet, startingPointPath);

  const newDoc = {
    ...clonedDoc,
    definitions: [
      {
        ...clonedDoc.definitions[0],
        selectionSet: {
          ...clonedDoc.definitions[0].selectionSet,
          selections: newSelectionSet,
        },
      },
    ],
  };

  if (name) {
    newDoc.definitions[0].selectionSet.selections[0].name.value = name;
  }

  return newDoc;
};
