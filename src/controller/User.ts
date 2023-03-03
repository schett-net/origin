import { Context } from "@snek-at/function";
import { GraphQLError } from "graphql";
import { sqAuthentication } from "../clients/authentication";
import { sqIAM } from "../clients/iam";
import {
  AuthenticationFailedError,
  AuthenticationRequiredError,
} from "../errors";
import AuthUtils from "../utils/AuthUtils";
import { TokenPair } from "../utils/TokenFactory";
import { Resource } from "./Resource";

export class User {
  static user = (context: Context) => async (id: string) => {
    const [user, errors] = await sqIAM.query((Query) => {
      const u = Query.user({ id });

      return {
        id: u.id,
        username: u.username?.username ?? "fallback",
        primaryEmail:
          u.account?.emailAddress?.emailAddress ?? "fallback@snek.at",
        emails: u.emails.map((e) => e.emailAddress),
        recourceId: u.resourceId,
      };
    });

    if (errors) {
      throw new Error(errors[0].message);
    }

    return new User(
      context,
      user.id,
      user.username,
      user.primaryEmail,
      user.emails,
      user.recourceId
    );
  };

  static users = (context: Context) => async (filter?: { ids?: string[] }) => {
    const [users, errors] = await sqIAM.query((Query) => {
      const u = Query.users({
        filter: {
          ids: filter?.ids,
        },
      });

      return u.map((u) => ({
        id: u.id,
        username: u.username?.username ?? "fallback",
        primaryEmail:
          u.account?.emailAddress?.emailAddress ?? "fallback@snek.at",
        emails: u.emails.map((e) => e.emailAddress),
        recourceId: u.resourceId,
      }));
    });

    if (errors) {
      throw new Error(errors[0].message);
    }

    return users.map(
      (user) =>
        new User(
          context,
          user.id,
          user.username,
          user.primaryEmail,
          user.emails,
          user.recourceId
        )
    );
  };

  static signIn =
    (context: Context) =>
    async (login: string, password: string, resourceId: string) => {
      const [userId, errors] = await sqAuthentication.mutate(
        (Mutation) =>
          Mutation.userAuthenticate({ login, password, resourceId })?.userId
      );

      console.log("userId", userId);

      if (errors) {
        throw new AuthenticationFailedError();
      }

      const authUtils = new AuthUtils(context);

      const user = await User.user(context)(userId);

      console.log("user", user);

      const state = authUtils.createState(
        {
          userId,
          resourceId,
        },
        {
          "*": user.isAdmin ? ["*"] : [],
        }
      );

      console.log("state", state);

      return {
        tokenPair: state.tokenPair,
        user,
        me: () => User.me(context)(resourceId),
      };
    };

  static signOut = (context: Context) => (resourceId?: string) => {
    const authUtils = new AuthUtils(context);

    authUtils.block(resourceId);

    return true;
  };

  static me = (context: Context) => (resourceId?: string) => {
    const authUtils = new AuthUtils(context);

    const authenticatedUsers = authUtils.authenticatedUsers();

    if (authenticatedUsers.length === 0) {
      throw new AuthenticationRequiredError();
    }

    return authenticatedUsers.map(({ payload }) => ({
      user: () => User.user(context)(payload.sub),
      issuedAt: () =>
        payload.iat ? new Date(payload.iat * 1000).toISOString() : null,
      expiresAt: () =>
        payload.exp ? new Date(payload.exp * 1000).toISOString() : null,
    }));
  };

  static refresh =
    (context: Context) => (accessToken: string, refreshToken: string) => {
      const authUtils = new AuthUtils(context);

      const { tokenPair, userId } = authUtils.refreshTokenPair(
        new TokenPair(accessToken, refreshToken)
      );

      return {
        tokenPair,
        me: () => User.me(context)(),
        user: () => User.user(context)(userId),
      };
    };

  #context: Context;

  id: string;
  username: string;
  primaryEmail: string;
  emails: string[];
  isAdmin: boolean;

  private resourceId: string;

  constructor(
    context: Context,
    id: string,
    username: string,
    primaryEmail: string,
    emails: string[],
    resourceId: string
  ) {
    this.#context = context;

    this.id = id;
    this.username = username;
    this.primaryEmail = primaryEmail;
    this.emails = emails;
    this.isAdmin = true;
    this.resourceId = resourceId;
  }

  resource = async () => Resource.resource(this.#context)(this.resourceId);
}
