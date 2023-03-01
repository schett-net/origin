import { GraphQLError } from "graphql";
import { Context, Decorator } from "@snek-at/function";

import AuthUtils from "../utils/AuthUtils";

export const isAuthenticated: Decorator<[resourceId: string]> = (
  context,
  [resourceId]
) => {
  if (!resourceId) throw new GraphQLError("No resourceId provided");

  const authUtils = new AuthUtils(context);

  try {
    authUtils.get(resourceId);

    return;
  } catch {}

  throw new GraphQLError(
    `You are not authenticated. Please login to access resource ${resourceId}`
  );
};

export const isAuthenticatedOnResource =
  (resourceId: string) => (context: Context) => {
    const authUtils = new AuthUtils(context);

    try {
      return authUtils.get(resourceId);
    } catch {}

    throw new GraphQLError(
      `You are not authenticated. Please login to access resource ${resourceId}`
    );
  };
