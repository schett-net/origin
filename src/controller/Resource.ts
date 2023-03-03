import { Context } from "@snek-at/function";
import { GraphQLError } from "graphql";

import { sqIAM } from "../clients/iam";
import { sqJaenAgent } from "../clients/jaenagent";
import { UnauthorizedError } from "../errors";
import AuthUtils from "../utils/AuthUtils";
import { User } from "./User";

export class Resource {
  static resource = (context: Context) => async (id: string) => {
    const [resource, errors] = await sqIAM.query((Query) => {
      const r = Query.resource({ id });

      return {
        id: r?.id,
        name: r.name,
      };
    });

    if (errors) {
      throw new Error(errors[0].message);
    }

    return new Resource(context, resource.id, resource.name);
  };

  static access = (context: Context) => async (id: string) => {
    const authUtils = new AuthUtils(context);

    const user = authUtils.authenticatedUser(
      "7f2734cf-9283-4568-94d1-8903354ca382"
    );

    const [usersUnderSameAccount, errors] = await sqIAM.query((Query) => {
      return (
        Query.user({ id: user.payload.sub }).account?.users.map((u) => {
          return {
            userId: u.id,
            resourceId: u.resourceId,
          };
        }) ?? []
      );
    });

    if (errors) {
      throw new Error(errors[0].message);
    }

    const requestedUser = usersUnderSameAccount.find(
      (u) => u.resourceId === id
    );

    if (requestedUser) {
      const state = authUtils.createState(requestedUser, user.payload.scope);

      // override context authorization
      context.req.headers[
        "authorization"
      ] = `Bearer ${state.tokenPair.accessToken}`;

      return {
        tokenPair: state.tokenPair,
        user: () => User.user(context)(requestedUser.userId),
        me: () => User.me(context)(),
      };
    }

    throw new UnauthorizedError();
  };

  static jaenPublish =
    (context: Context) => async (resourceId: string, migrationURL: string) => {
      const r = await Resource.resource(context)(resourceId);
      const config = await r.config();

      if (!config.jaen) {
        throw new GraphQLError(
          "When publishing to jaen, you need to provide a `jaen` config"
        );
      }

      const githubAccessToken = (await r.secret("JAEN_GITHUB_ACCESS_TOKEN"))
        .value;

      const repository = config.jaen.repository;
      const repositoryCwd = config.jaen.repositoryCwd;

      if (!repository) {
        throw new GraphQLError("No `githubRemote` config found");
      }

      if (!githubAccessToken) {
        throw new GraphQLError("No `JAEN_GITHUB_ACCESS_TOKEN` secret found");
      }

      const publishConfig: {
        repository: string;
        repositoryCwd?: string;
        githubAccessToken: string;
      } = {
        repository,
        githubAccessToken,
      };

      if (repositoryCwd) {
        publishConfig.repositoryCwd = repositoryCwd;
      }

      const [_, errors] = await sqJaenAgent.mutate((Mutation) => {
        Mutation.publish({
          migrationURL,
          config: publishConfig,
        });
      });

      if (errors) {
        throw new GraphQLError(errors[0].message);
      }

      return "Published";
    };

  #context: Context;

  id: string;
  name: string;

  constructor(context: Context, id: string, name: string) {
    this.#context = context;
    this.id = id;
    this.name = name;
  }

  /**
   * Authorization required
   */
  async config(): Promise<{
    jaen?: {
      repository: string;
      repositoryCwd?: string;
    };
    access?: {
      baseURL: string;
      signInURL?: string;
      signOutURL?: string;
    };
  }> {
    const authUtils = new AuthUtils(this.#context);

    if (!authUtils.isResourceAuthenticated(this.id)) {
      throw new UnauthorizedError();
    }

    const [config, errors] = await sqIAM.query((Query) => {
      const c = Query.resource({ id: this.id }).config;

      return c.value;
    });

    if (errors) {
      throw new Error(errors[0].message);
    }

    return config;
  }

  /**
   * Authorization required
   */
  async secret(name: string) {
    const authUtils = new AuthUtils(this.#context);

    if (!authUtils.isResourceAuthenticated(this.id)) {
      throw new UnauthorizedError();
    }

    const [secret, errors] = await sqIAM.query((Query) => {
      const s = Query.resource({ id: this.id }).secret({ name });

      return {
        name: s.name,
        value: s.value,
      };
    });

    if (errors) {
      throw new Error(errors[0].message);
    }

    return secret;
  }
}
