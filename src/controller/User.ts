import { Context } from "@snek-at/function";
import { GraphQLError } from "graphql";
import { sqAuthentication } from "../clients/authentication";
import { sqIAM } from "../clients/iam";
import { AuthenticationRequiredError } from "../errors";
import AuthUtils from "../utils/AuthUtils";
import { TokenPair } from "../utils/TokenFactory";
import { Resource } from "./Resource";

export class User {
  static async user(id: string) {
    const [user, errors] = await sqIAM.query((Query) => {
      const u = Query.user({ id });

      return {
        id: u.id,
        username: u.username?.username ?? "fallback",
        primaryEmail: u.account?.email?.email ?? "fallback@snek.at",
        emails: u.emails.map((e) => e.email),
        recourceId: u.resourceId,
      };
    });

    if (errors) {
      throw new Error(errors[0].message);
    }

    return new User(
      user.id,
      user.username,
      user.primaryEmail,
      user.emails,
      user.recourceId
    );
  }

  static async users(filter?: { ids?: string[] }) {
    const [users, errors] = await sqIAM.query((Query) => {
      const u = Query.users({
        filter: {
          ids: filter?.ids,
        },
      });

      return u.map((u) => ({
        id: u.id,
        username: u.username?.username ?? "fallback",
        primaryEmail: u.account?.email?.email ?? "fallback@snek.at",
        emails: u.emails.map((e) => e.email),
        recourceId: u.resourceId,
      }));
    });

    if (errors) {
      throw new Error(errors[0].message);
    }

    return users.map(
      (user) =>
        new User(
          user.id,
          user.username,
          user.primaryEmail,
          user.emails,
          user.recourceId
        )
    );
  }

  static signIn =
    (context: Context) =>
    async (login: string, password: string, resourceId: string) => {
      const [userId, errors] = await sqAuthentication.mutate(
        (Mutation) =>
          Mutation.userAuthenticate({ login, password, resourceId })?.userId
      );

      if (errors) {
        throw new GraphQLError(`Authentication failed`);
      }

      const authUtils = new AuthUtils(context);

      const user = await User.user(userId);

      const state = authUtils.createState(
        {
          userId,
          resourceId,
        },
        {
          "*": user.isAdmin ? ["*"] : [],
        }
      );

      return {
        tokenPair: state.tokenPair,
        user,
        me: () => User.me(context)(),
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
      user: () => User.user(payload.sub),
      issuedAt: () =>
        payload.iat ? new Date(payload.iat * 1000).toISOString() : null,
      expiresAt: () =>
        payload.exp ? new Date(payload.exp * 1000).toISOString() : null,
    }));
  };

  static refresh =
    (context: Context) => (accessToken: string, refreshToken: string) => {
      const authUtils = new AuthUtils(context);

      const tokenPair = authUtils.refreshTokenPair(
        new TokenPair(accessToken, refreshToken)
      );

      return {
        tokenPair,
        me: () => User.me(context)(),
      };
    };

  id: string;
  username: string;
  primaryEmail: string;
  emails: string[];
  isAdmin: boolean;

  private resourceId: string;

  constructor(
    id: string,
    username: string,
    primaryEmail: string,
    emails: string[],
    resourceId: string
  ) {
    this.id = id;
    this.username = username;
    this.primaryEmail = primaryEmail;
    this.emails = emails;
    this.isAdmin = true;
    this.resourceId = resourceId;
  }

  resource = async () => Resource.resource(this.resourceId);
}
