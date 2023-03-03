import { GraphQLError } from "graphql";
import { Context } from "@snek-at/function/dist/withContext";
import { TokenFactory, TokenPair } from "./TokenFactory";
import { AuthenticationRequiredError, InvalidTokenError } from "../errors";

interface AuthState {
  userId: string;
  resourceId: string;
  scope: {
    [key: string]: string[];
  };
  tokenPair: TokenPair;
}

export default class AuthUtils {
  static accessTokenBlacklist: string[] = [];

  constructor(public context: Context) {
    this.context = context;
  }

  createState(
    ids: {
      userId: string;
      resourceId: string;
    },
    scope: AuthState["scope"]
  ): AuthState {
    const tokenPair = TokenFactory.createTokenPair(ids, scope);

    return {
      userId: ids.userId,
      resourceId: ids.resourceId,
      scope,
      tokenPair,
    };
  }

  refreshTokenPair(tokenPair: TokenPair): AuthState {
    const { accessToken, refreshToken } = tokenPair;

    // check if access token is blacklisted

    if (this.isBlacklisted(accessToken)) {
      throw new InvalidTokenError();
    }

    // check if access token is valid

    const accessTokenPayload = TokenFactory.readToken(accessToken, {
      ignoreExpiration: true,
    });

    const refreshedTokenPair =
      TokenFactory.createTokenPairFromRefreshToken(refreshToken);

    return {
      userId: accessTokenPayload.sub,
      resourceId: accessTokenPayload.resourceId,
      scope: accessTokenPayload.scope,
      tokenPair: refreshedTokenPair,
    };
  }

  authenticatedUsers = () => {
    // Get all Authorization headers from the request
    const authHeaders = this.context.req.headers.authorization?.split(", ");

    // Get all access tokens from the Authorization headers
    const accessTokens = authHeaders?.map((header) => {
      const [type, token] = header.split(" ");

      if (type !== "Bearer") {
        throw new InvalidTokenError();
      }

      return {
        payload: TokenFactory.readToken(token),
        raw: token,
      };
    });

    // Get all user ids from the access tokens

    return accessTokens || [];
  };

  authenticatedUser(resourceId: string) {
    const authenticatedUsers = this.authenticatedUsers();

    const found = authenticatedUsers.find(
      (user) => user.payload.resourceId === resourceId
    );

    if (!found) {
      throw new AuthenticationRequiredError();
    }

    return found;
  }

  isBlacklisted(token: string) {
    return AuthUtils.accessTokenBlacklist.includes(token);
  }

  isResourceAuthenticated(resourceId: string) {
    const found = this.authenticatedUser(resourceId);

    // check if the token is blacklisted
    if (found) {
      if (this.isBlacklisted(found.raw)) {
        return false;
      }
      return true;
    }

    return false;
  }

  block(resourceId?: string) {
    // Block the user from accessing the resource or all authenticated users

    const authenticatedUsers = this.authenticatedUsers();

    if (resourceId) {
      // Block the user from accessing the resource

      const payload = authenticatedUsers.find(
        (user) => user.payload.resourceId === resourceId
      );

      if (!payload) {
        throw new GraphQLError("Cannot block user from resource");
      }

      AuthUtils.accessTokenBlacklist.push(payload.raw);
    } else {
      // Block all authenticated users

      authenticatedUsers.forEach((user) => {
        AuthUtils.accessTokenBlacklist.push(user.raw);
      });
    }
  }
}
