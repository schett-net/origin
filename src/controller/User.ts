import { Context } from "@snek-at/function";
import { GraphQLError } from "graphql";
import { sqAuthentication } from "../clients/authentication";
import { sqIAM } from "../clients/iam";
import AuthUtils from "../utils/AuthUtils";
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
    async (
      login: string,
      password: string,
      resourceId: string,
      isSession?: boolean
    ) => {
      const [userId, errors] = await sqAuthentication.mutate(
        (Mutation) =>
          Mutation.userAuthenticate({ login, password, resourceId })?.userId
      );

      console.log(userId);

      if (errors) {
        console.error(errors);
        throw new GraphQLError(`Authentication failed`);
      }

      const authUtils = new AuthUtils(context);

      const user = await User.user(userId);

      const state = authUtils.set(resourceId, userId, isSession, {
        "*": user.isAdmin ? ["*"] : [],
      });

      const totalUsers = authUtils.all().length;

      return {
        tokenPair: state.tokenPair,
        user,
        /**
         * Is off by one because the user is not yet added to the state on first login
         */
        totalUsers,
      };
    };

  static signOut = (context: Context) => async (resourceId?: string) => {
    const authUtils = new AuthUtils(context);

    if (resourceId) {
      authUtils.delete(resourceId);
    } else {
      authUtils.clear();
    }

    return true;
  };

  static me = (context: Context) => async (resourceId?: string) => {
    const authUtils = new AuthUtils(context);

    if (!resourceId) {
      const allState = authUtils.all();

      return {
        totalUsers: allState.length,
        users: allState.map((state) => ({
          tokenPair: state.tokenPair,
          user: () => User.user(state.userId),
        })),
      };
    } else {
      const state = authUtils.get(resourceId);

      if (!state) {
        throw new GraphQLError(`Not authenticated`);
      }

      return {
        totalUsers: 1,
        users: [
          { tokenPair: state.tokenPair, user: () => User.user(state.userId) },
        ],
      };
    }
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
