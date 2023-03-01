import { defineService, withContext } from "@snek-at/function";
import cors from "cors";
import { GraphQLError } from "graphql";

import { sqJaenAgent } from "./clients/jaenagent";

import { Resource } from "./controller/Resource";
import { User } from "./controller/User";
import { isAuthenticated } from "./decorators/auth";

export default defineService(
  {
    Query: {
      me: withContext(User.me),
      resource: Resource.resource,
    },
    Mutation: {
      signIn: withContext(User.signIn),
      signOut: withContext(User.signOut),
      resourceSignIn: withContext(Resource.resourceSignIn),
      jaenPublish: withContext(
        () => async (resourceId: string, migrationURL: string) => {
          const r = await Resource.resource(resourceId);

          const [res, errors] = await sqJaenAgent.mutate((Mutation) => {
            return Mutation.publish({
              migrationURL,
              config: {
                jaenGitHubRemote: "",
                jaenGitHubCwd: "",
                jaenGitHubAccessToken: "",
              },
            });
          });

          if (errors) {
            throw new GraphQLError(errors[0].message);
          }

          return res;
        },
        {
          decorators: [isAuthenticated],
        }
      ),
    },
  },
  {
    configureApp(app) {
      app.use((req, res, next) => {
        return cors({
          origin: true,
          credentials: true,
        })(req, res, next);
      });

      app.get("/auth", (req, res) => {
        // set cookie and redirect to frontend
        res.cookie("token", "1234512345123451235", {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
        });

        // redirect to origin
        res.redirect("https://snek.at");
      });

      return app;
    },
  }
);
