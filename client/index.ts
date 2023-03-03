import { makeSnekQuery } from "snek-query";
import {
  Query,
  Mutation,
  TokenPair as _TokenPair,
} from "./schema.generated";

type TokenPair = Pick<_TokenPair, "accessToken" | "refreshToken">;

export const sq = makeSnekQuery(
  { Query, Mutation },
  {
    apiURL: "https://services.snek.at/origin/graphql",
    middlewares: [
      ({ context }) => {
        const tokenPair = getTokenPair();

        if (!tokenPair) {
          return context;
        }

        return {
          ...context,
          headers: {
            ...context.headers,
            Authorization: `Bearer ${tokenPair.accessToken}`,
          },
        };
      },
    ],
    onError: async ({ graphQLErrors, forward, operation }) => {
      if (!graphQLErrors) {
        return;
      }

      const tokenPair = getTokenPair();

      if (!tokenPair) {
        return;
      }

      for (const err of graphQLErrors) {
        if (err.extensions?.code === "TOKEN_EXPIRED") {
          const [newTokens, errors] = await sq.mutate((Mutation) => {
            const refresh = Mutation.refresh({
              refreshToken: tokenPair.refreshToken,
              accessToken: tokenPair.accessToken,
            }).tokenPair;

            return {
              accessToken: refresh.accessToken,
              refreshToken: refresh.refreshToken,
            };
          });

          if (errors) {
            return;
          }

          setTokenPair(newTokens, true);

          operation.setContext({
            headers: {
              ...operation.getContext().headers,
              Authorization: `Bearer ${newTokens.accessToken}`,
            },
          });

          return forward(operation);
        } else if (err.extensions?.code === "REFRESH_TOKEN_EXPIRED") {
          return;
        }
      }
    },
  }
);

const TOKEN_PAIR_KEY = "@sq-origin/tokenPair";

export const setTokenPair = (
  tokenPair: TokenPair | null,
  isSession?: boolean
) => {
  if (!tokenPair) {
    // remove key from both local and session storage
    sessionStorage.removeItem(TOKEN_PAIR_KEY);
    localStorage.removeItem(TOKEN_PAIR_KEY);
  } else {
    const storage = isSession ? sessionStorage : localStorage;

    storage.setItem(TOKEN_PAIR_KEY, JSON.stringify(tokenPair));
  }
};

export const getTokenPair = () => {
  // lookup key in both local and session storage

  const tokenPair =
    sessionStorage.getItem(TOKEN_PAIR_KEY) ||
    localStorage.getItem(TOKEN_PAIR_KEY);

  if (!tokenPair) {
    return null;
  }

  return JSON.parse(tokenPair) as TokenPair;
};
