import { Context } from "@snek-at/function";
import { GraphQLError } from "graphql";

import { sqIAM } from "../clients/iam";
import { sqJaenAgent } from "../clients/jaenagent";

export class Resource {
  static resource = (context: Context) => async (id: string) => {
    const [resource, errors] = await sqIAM.query(
      (Query) => {
        const r = Query.resource({ id });

        return {
          id: r?.id,
          name: r.name,
        };
      },
      {
        headers: {
          Authorization: context.req.headers.authorization,
        },
      }
    );

    if (errors) {
      throw new GraphQLError(errors[0].message, {
        extensions: errors[0].extensions,
      });
    }

    return new Resource(context, resource);
  };

  #context: Context;

  id: string;
  name: string;

  constructor(context: Context, data: { id: string; name: string }) {
    this.#context = context;

    for (const key in data) {
      this[key] = data[key];
    }
  }

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
        throw new GraphQLError(errors[0].message, {
          extensions: errors[0].extensions,
        });
      }

      return "Published";
    };

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
    const [config, errors] = await sqIAM.query(
      (Query) => {
        const c = Query.resource({ id: this.id }).config;

        return c.value;
      },
      {
        headers: {
          Authorization: this.#context.req.headers.authorization || "",
        },
      }
    );

    if (errors) {
      throw new GraphQLError(errors[0].message, {
        extensions: errors[0].extensions,
      });
    }

    return config;
  }

  async secret(name: string) {
    const [secret, errors] = await sqIAM.query(
      (Query) => {
        const s = Query.resource({ id: this.id }).secret({ name });

        return {
          name: s.name,
          value: s.value,
        };
      },
      {
        headers: {
          Authorization: this.#context.req.headers.authorization || "",
        },
      }
    );

    if (errors) {
      throw new GraphQLError(errors[0].message, {
        extensions: errors[0].extensions,
      });
    }

    return secret;
  }
}
