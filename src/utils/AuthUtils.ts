import { GraphQLError } from "graphql";
import { Context } from "@snek-at/function/dist/withContext";
import TokenUtils, { TokenFactory, TokenPair } from "./TokenUtils";

interface AuthState {
  userId: string;
  scope: {
    [key: string]: string[];
  };
  tokenPair: TokenPair;
}

export default class AuthUtils {
  public tokenUtils: TokenUtils;

  constructor(public context: Context) {
    this.context = context;
    this.tokenUtils = new TokenUtils(context);
  }

  set(
    resdId: string,
    userId: string,
    isSession?: boolean,
    scope: {
      [key: string]: string[];
    } = {}
  ): AuthState {
    const tokenPair = TokenFactory.createTokenPair(userId, scope);

    this.tokenUtils.set(resdId, tokenPair, isSession);

    const authState: AuthState = {
      userId,
      scope,
      tokenPair,
    };

    return authState;
  }

  get(resdId: string, isSession?: boolean): AuthState {
    let tokenPair = this.tokenUtils.get(resdId);

    console.log("authState tokenPair", tokenPair);

    if (!tokenPair.accessToken && !tokenPair.refreshToken) {
      throw new Error("No token pair found");
    } else if (!tokenPair.accessToken && tokenPair.refreshToken) {
      console.log("createTokenPairFromToken access");

      try {
        tokenPair = TokenFactory.createTokenPairFromToken(
          tokenPair.refreshToken
        );
        this.tokenUtils.set(resdId, tokenPair, isSession);
      } catch (e) {
        throw new GraphQLError("Refresh token expired. Please login again");
      }
    } else if (!tokenPair.refreshToken) {
      throw new GraphQLError("No refresh token found. Please login again");
    }

    console.log("authState tokenPair 2", tokenPair);

    const payload = TokenFactory.readToken(tokenPair.accessToken);

    const authState: AuthState = {
      userId: payload.sub,
      scope: payload.scope,
      tokenPair,
    };

    return authState;
  }

  delete(resdId: string) {
    this.tokenUtils.delete(resdId);
  }

  clear() {
    this.tokenUtils.clear();
  }

  all(): AuthState[] {
    const resourceIds = this.tokenUtils.allResourceIds();

    const authStates: AuthState[] = [];

    resourceIds.forEach((resourceId) => {
      authStates.push(this.get(resourceId));
    });

    return authStates;
  }
}
