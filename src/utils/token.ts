import { sq as sqJWT } from "@snek-functions/jwt";
import { GraphQLError } from "graphql";

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const tokenCreate = async (
  userId: string,
  resourceId: string,
  scope: object = {}
): Promise<TokenPair> => {
  const [tokenPair, jwtErrors] = await sqJWT.mutate((Mutation) => {
    const t = Mutation.tokenCreate({
      userId,
      resourceId,
      scope,
    });

    return {
      accessToken: t.accessToken,
      refreshToken: t.refreshToken,
    };
  });

  if (jwtErrors) {
    throw new GraphQLError(jwtErrors[0].message, {
      extensions: jwtErrors[0].extensions,
    });
  }

  return tokenPair;
};

export const tokenRefresh = async (tokenPair: {
  accessToken: string;
  refreshToken: string;
}): Promise<TokenPair> => {
  const [newTokenPair, jwtErrors] = await sqJWT.mutate((Mutation) => {
    const t = Mutation.tokenRefresh({
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    });

    return {
      accessToken: t.accessToken,
      refreshToken: t.refreshToken,
    };
  });

  if (jwtErrors) {
    throw new GraphQLError(jwtErrors[0].message, {
      extensions: jwtErrors[0].extensions,
    });
  }

  return newTokenPair;
};
