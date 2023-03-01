import { CookieOptions } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";

import { Context } from "@snek-at/function/dist/withContext";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export default class TokenUtils {
  static readonly ACCESS_TOKEN_COOKIE_NAME = "snek-0-access";
  static readonly REFRESH_TOKEN_COOKIE_NAME = "snek-0-refresh";

  static readonly cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  };

  constructor(public context: Context) {
    this.context = context;
  }

  private setCookie(name: string, token: string, options: CookieOptions) {
    this.context.res.cookie(name, token, {
      ...TokenUtils.cookieOptions,
      ...options,
    });
  }

  private deleteCookie(name: string) {
    this.context.res.clearCookie(name, {
      ...TokenUtils.cookieOptions,
    });
  }

  allResourceIds(): string[] {
    // Get all resource ids from cookies (access and refresh)

    const cookies = Object.keys(this.context.req.cookies);

    const resourceIds: string[] = [];

    cookies.forEach((cookie) => {
      if (
        cookie.startsWith(TokenUtils.ACCESS_TOKEN_COOKIE_NAME) ||
        cookie.startsWith(TokenUtils.REFRESH_TOKEN_COOKIE_NAME)
      ) {
        const resourceId = cookie.split("/")[1];

        if (!resourceIds.includes(resourceId)) {
          resourceIds.push(resourceId);
        }
      }
    });

    return resourceIds;
  }

  set(resdId: string, tokenPair: TokenPair, isSession?: boolean): void {
    // Set token pair in cookies

    this.setCookie(
      `${TokenUtils.ACCESS_TOKEN_COOKIE_NAME}/${resdId}`,
      tokenPair.accessToken,
      {
        maxAge: isSession ? undefined : 1000 * 60 * 5, // 5 minutes
      }
    );

    this.setCookie(
      `${TokenUtils.REFRESH_TOKEN_COOKIE_NAME}/${resdId}`,
      tokenPair.refreshToken,
      {
        maxAge: isSession ? undefined : 1000 * 60 * 60 * 24 * 7, // 7 days
      }
    );
  }

  get(resdId: string): TokenPair {
    // Get token pair from cookies

    const accessToken =
      this.context.req.cookies[
        `${TokenUtils.ACCESS_TOKEN_COOKIE_NAME}/${resdId}`
      ];

    const refreshToken =
      this.context.req.cookies[
        `${TokenUtils.REFRESH_TOKEN_COOKIE_NAME}/${resdId}`
      ];

    return {
      accessToken,
      refreshToken,
    };
  }

  delete(resdId: string): void {
    // Delete token pair from cookies

    this.deleteCookie(`${TokenUtils.ACCESS_TOKEN_COOKIE_NAME}/${resdId}`);

    this.deleteCookie(`${TokenUtils.REFRESH_TOKEN_COOKIE_NAME}/${resdId}`);
  }

  clear(): void {
    // Delete all token pairs from cookies

    const cookies = Object.keys(this.context.req.cookies);

    cookies.forEach((cookie) => {
      if (
        cookie.startsWith(TokenUtils.ACCESS_TOKEN_COOKIE_NAME) ||
        cookie.startsWith(TokenUtils.REFRESH_TOKEN_COOKIE_NAME)
      ) {
        this.deleteCookie(cookie);
      }
    });
  }

  all(): {
    [key: string]: TokenPair;
  } {
    // Get all token pairs from cookies

    const resourceIds = this.allResourceIds();

    const tokenPairs: {
      [key: string]: TokenPair;
    } = {};

    resourceIds.forEach((resourceId) => {
      tokenPairs[resourceId] = this.get(resourceId);
    });

    return tokenPairs;
  }
}

export interface FactoryToken {
  token: string;
  jwtId: string;
}

export interface TokenPayload extends JwtPayload {
  type: "access" | "refresh";
  scope: {
    [key: string]: string[];
  };
  sub: string;
}

export class TokenFactory {
  private static readonly SHARED_SECRET = process.env.SHARED_SECRET || "snek-0";
  private static readonly ISSUER = process.env.ISSUER || "snek-0";
  private static readonly ACCESS_TOKEN_DURATION = "5m";
  private static readonly REFRESH_TOKEN_DURATION = "30d";

  private static createToken(
    type: "access" | "refresh",
    userId: string,
    scope: {
      [key: string]: string[];
    },
    jwtId?: string
  ): FactoryToken {
    // Create access token

    jwtId = jwtId || crypto.randomUUID();

    let duration: string | undefined = undefined;

    if (type === "access") {
      duration = this.ACCESS_TOKEN_DURATION;
    } else if (type === "refresh") {
      duration = this.REFRESH_TOKEN_DURATION;
    }

    const token = jwt.sign(
      {
        type,
        scope,
      },
      this.SHARED_SECRET,
      {
        algorithm: "HS256",
        subject: userId,
        expiresIn: duration,
        issuer: this.ISSUER,
        jwtid: jwtId,
        audience: "",
      }
    );

    return {
      token,
      jwtId,
    };
  }

  static readToken(token: string, options?: jwt.VerifyOptions): TokenPayload {
    // Read access token

    const payload = jwt.verify(
      token,
      this.SHARED_SECRET,
      options
    ) as TokenPayload;

    // Throw error if token has no subject, type or scope

    if (!payload.sub) {
      throw new Error("Invalid token. Subject is missing");
    } else if (!payload.type) {
      throw new Error("Invalid token. Type is missing");
    } else if (!payload.scope) {
      throw new Error("Invalid token. Scope is missing");
    }

    return payload;
  }

  static createTokenPair(
    userId: string,
    scope: any,
    refreshTokenPayload?: TokenPayload
  ): TokenPair {
    if (refreshTokenPayload) {
      // Validate refresh token

      // if (refreshTokenPayload.type !== "refresh") {
      //   throw new Error("Invalid refresh token");
      // }

      if (refreshTokenPayload.sub !== userId) {
        throw new Error("Invalid refresh token. User ID does not match");
      }

      // Create new access token
      const accessToken = this.createToken(
        "access",
        userId,
        scope,
        refreshTokenPayload.jti
      );

      // Create new refresh token
      const refreshToken = this.createToken("refresh", userId, scope);

      return {
        accessToken: accessToken.token,
        refreshToken: refreshToken.token,
      };
    } else {
      // Create new access token
      const accessToken = this.createToken("access", userId, scope);

      // Create new refresh token
      const refreshToken = this.createToken(
        "refresh",
        userId,
        scope,
        accessToken.jwtId
      );

      return {
        accessToken: accessToken.token,
        refreshToken: refreshToken.token,
      };
    }
  }

  static createTokenPairFromToken(token: string): TokenPair {
    const refreshTokenPayload = this.readToken(token);

    return this.createTokenPair(
      refreshTokenPayload.sub,
      refreshTokenPayload.scope,
      refreshTokenPayload
    );
  }
}
