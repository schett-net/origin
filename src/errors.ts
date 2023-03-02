import { GraphQLError, GraphQLErrorExtensions } from "graphql";

export class InvalidTokenError extends GraphQLError {
  extensions: GraphQLErrorExtensions;
  constructor() {
    super("Invalid token");
    this.extensions = {
      statusCode: 401,
      code: "INVALID_TOKEN",
      description: "The token provided is invalid or has expired",
    };
  }
}

export class TokenExpiredError extends GraphQLError {
  extensions: GraphQLErrorExtensions;
  constructor() {
    super("Token expired");
    this.extensions = {
      statusCode: 401,
      code: "TOKEN_EXPIRED",
      description: "The token provided has expired and a new token is required",
    };
  }
}

export class RefreshTokenExpiredError extends GraphQLError {
  extensions: GraphQLErrorExtensions;
  constructor() {
    super("Refresh token expired");
    this.extensions = {
      statusCode: 401,
      code: "REFRESH_TOKEN_EXPIRED",
      description:
        "The refresh token provided has expired and a new token is required",
    };
  }
}

export class TokenMissingError extends GraphQLError {
  extensions: GraphQLErrorExtensions;
  constructor() {
    super("Token missing");
    this.extensions = {
      statusCode: 401,
      code: "TOKEN_MISSING",
      description: "A token is required to access this resource",
    };
  }
}

export class RefreshTokenRequiredError extends GraphQLError {
  extensions: GraphQLErrorExtensions;
  constructor() {
    super("Refresh token required");
    this.extensions = {
      statusCode: 401,
      code: "REFRESH_TOKEN_REQUIRED",
      description: "A refresh token is required to obtain a new access token",
    };
  }
}

export class AuthenticationRequiredError extends GraphQLError {
  extensions: GraphQLErrorExtensions;
  constructor() {
    super("Authentication required");
    this.extensions = {
      statusCode: 401,
      code: "AUTHENTICATION_REQUIRED",
      description: "Authentication is required to access this resource",
    };
  }
}

export class UnauthorizedError extends GraphQLError {
  extensions: GraphQLErrorExtensions;
  constructor() {
    super("Unauthorized");
    this.extensions = {
      statusCode: 403,
      code: "UNAUTHORIZED",
      description: "You are not authorized to perform this action",
    };
  }
}

export class InputValidationError extends GraphQLError {
  extensions: GraphQLErrorExtensions;
  constructor(message: string, field: string) {
    super(message);
    this.extensions = {
      statusCode: 400,
      code: "INPUT_VALIDATION_FAILED",
      field,
    };
  }
}

// ... other custom errors for your application
