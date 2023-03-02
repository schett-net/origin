import { GraphQLError } from "graphql";
import { Context, Decorator } from "@snek-at/function";

import AuthUtils from "../utils/AuthUtils";
import { AuthenticationRequiredError } from "../errors";

export const isAuthenticated: Decorator<[resourceId: string]> = (
  context,
  [resourceId]
) => {
  if (!resourceId) throw new GraphQLError("No resourceId provided");

  const authUtils = new AuthUtils(context);

  const isResourceAuthenticated = authUtils.isResourceAuthenticated(resourceId);

  if (isResourceAuthenticated) return;

  throw new AuthenticationRequiredError();
};

export const isAuthenticatedOnResource =
  (resourceId: string) => (context: Context) => {
    const authUtils = new AuthUtils(context);

    const isResourceAuthenticated =
      authUtils.isResourceAuthenticated(resourceId);

    if (isResourceAuthenticated) return;

    throw new AuthenticationRequiredError();
  };
