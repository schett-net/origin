import { GraphQLError } from "graphql";
import { Context } from "@snek-at/function";

import { sqIAM } from "../clients/iam";
import { sqJaenAgent } from "../clients/jaenagent";
import { isAuthenticatedOnResource } from "../decorators/auth";
import AuthUtils from "../utils/AuthUtils";
import { doNotConvertToString } from "snek-query";

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
      console.log("pass auth");
      const r = await Resource.resource(resourceId);
      console.log("r", r);

      const config = await r.config();

      console.log("config", config);

      if (!config.jaen) {
        throw new GraphQLError("No `jaen` config found in resource config");
      }

      const jaenGitHubAccessToken = (await r.secret("JAEN_GITHUB_ACCESS_TOKEN"))
        .value;

      const jaenGitHubRemote = config.jaen.githubRemote;
      const jaenGitHubCwd = config.jaen.githubCwd;

      if (!jaenGitHubRemote) {
        throw new GraphQLError("No `githubRemote` config found");
      }

      if (!jaenGitHubAccessToken) {
        throw new GraphQLError("No `JAEN_GITHUB_ACCESS_TOKEN` secret found");
      }

      const publishConfig: {
        jaenGitHubRemote: string;
        jaenGitHubCwd?: string;
        jaenGitHubAccessToken: string;
      } = {
        jaenGitHubRemote,
        jaenGitHubAccessToken,
      };

      if (jaenGitHubCwd) {
        publishConfig.jaenGitHubCwd = jaenGitHubCwd;
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

  async config(): Promise<Record<string, any>> {
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
