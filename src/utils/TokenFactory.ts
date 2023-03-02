import jwt, { VerifyOptions } from "jsonwebtoken";
import crypto from "crypto";
import {
  InvalidTokenError,
  RefreshTokenExpiredError,
  TokenExpiredError,
} from "../errors";

interface FactoryToken {
  token: string;
  jwtId: string;
}

export class TokenPair {
  accessToken: string;
  refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  headers(): {} {
    return {
      Authorization: `Bearer ${this.accessToken}`,
    };
  }
}

interface UserTokenPayload {
  type: "access" | "refresh";
  sub: string;
  resourceId: string;
  scope: { [key: string]: string[] };
  iat?: number;
  exp?: number;
  jti?: string;
}

export class TokenFactory {
  private static readonly SHARED_SECRET = process.env.SHARED_SECRET || "snek-0";
  private static readonly ISSUER = process.env.ISSUER || "snek-0";
  private static readonly ACCESS_TOKEN_DURATION = "5m";
  private static readonly REFRESH_TOKEN_DURATION = "30d";

  private static createToken(
    type: "access" | "refresh",
    ids: {
      userId: string;
      resourceId: string;
    },
    scope: UserTokenPayload["scope"],
    jwtId?: string
  ): FactoryToken {
    jwtId = jwtId || crypto.randomUUID();

    let duration: string | undefined = undefined;

    if (type === "access") {
      duration = this.ACCESS_TOKEN_DURATION;
    } else if (type === "refresh") {
      duration = this.REFRESH_TOKEN_DURATION;
    }

    const payload: UserTokenPayload = {
      sub: ids.userId,
      resourceId: ids.resourceId,
      type,
      scope,
    };

    const token = jwt.sign(payload, this.SHARED_SECRET, {
      algorithm: "HS256",
      expiresIn: duration,
      issuer: this.ISSUER,
      jwtid: jwtId,
      audience: "",
    });

    return {
      token,
      jwtId,
    };
  }

  static readToken(token: string, options?: VerifyOptions): UserTokenPayload {
    let payload: UserTokenPayload;

    try {
      payload = jwt.verify(
        token,
        this.SHARED_SECRET,
        options
      ) as UserTokenPayload;
    } catch {
      throw new TokenExpiredError();
    }

    if (!payload.scope) {
      throw new InvalidTokenError();
    }

    return payload;
  }

  static createTokenPair(
    ids: {
      userId: string;
      resourceId: string;
    },
    scope: UserTokenPayload["scope"],
    refreshTokenPayload?: UserTokenPayload
  ): TokenPair {
    if (refreshTokenPayload) {
      if (refreshTokenPayload.sub !== ids.userId) {
        throw new InvalidTokenError();
      }

      const accessToken = this.createToken(
        "access",
        ids,
        scope,
        refreshTokenPayload.jti
      );

      const refreshToken = this.createToken(
        "refresh",
        ids,
        scope,
        accessToken.jwtId
      );

      return new TokenPair(accessToken.token, refreshToken.token);
    } else {
      const accessToken = this.createToken("access", ids, scope);
      const refreshToken = this.createToken(
        "refresh",
        ids,
        scope,
        accessToken.jwtId
      );

      return new TokenPair(accessToken.token, refreshToken.token);
    }
  }

  static createTokenPairFromRefreshToken(token: string): TokenPair {
    let payload;

    try {
      payload = this.readToken(token);
    } catch (e) {
      throw new RefreshTokenExpiredError();
    }

    if (payload.type !== "refresh") {
      throw new InvalidTokenError();
    }

    return this.createTokenPair(
      {
        userId: payload.sub,
        resourceId: payload.resourceId,
      },
      payload.scope,
      payload
    );
  }
}
