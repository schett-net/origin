import { bindWithContext, withContext } from "@snek-at/function";
import { GraphQLError } from "graphql";

import { requireUserAuth } from "@snek-functions/jwt";
import { sqJaenAgent } from "../clients/jaenagent/src";
import { Resource } from "./Resource";

export class Jaen {
  static publish = withContext(
    (context) => async (resourceId: string, migrationURL: string) => {
      const r = await bindWithContext(context, Resource.resource)(resourceId);
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
    },
    {
      decorators: [requireUserAuth],
    }
  );
}
