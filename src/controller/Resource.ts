import { Context } from "@snek-at/function";
import { GraphQLError } from "graphql";

import { sqIAM } from "../clients/iam";
import { sqJaenAgent } from "../clients/jaenagent";

export class Resource {
  static async resource(id: string) {
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

    return new Resource(resource.id, resource.name);
  }

  static resourceSignIn = (context: Context) => async (id: string) => {
    return "Theore this should perform a sign in on the resource";
  };

  static jaenPublish =
    () => async (resourceId: string, migrationURL: string) => {
      const r = await Resource.resource(resourceId);
      const config = await r.config();

      console.log("config", config);

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

  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

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
    const [config, errors] = await sqIAM.query((Query) => {
      const c = Query.resource({ id: this.id }).config;

      return c.value;
    });

    if (errors) {
      throw new Error(errors[0].message);
    }

    return config;
  }

  async secret(name: string) {
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
