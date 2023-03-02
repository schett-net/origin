import { defineService, withContext } from "@snek-at/function";
import cors from "cors";
import { GraphQLError } from "graphql";

import { sqJaenAgent } from "./clients/jaenagent";

import { Resource } from "./controller/Resource";
import { User } from "./controller/User";
import { isAuthenticated, isAuthenticatedOnResource } from "./decorators/auth";

export default defineService(
  {
    Query: {
      me: withContext(User.me),
    },
    Mutation: {
      signIn: withContext(User.signIn),
      signOut: withContext(User.signOut),
      refresh: withContext(User.refresh),
      resourceSignIn: withContext(Resource.resourceSignIn, {
        decorators: [
          isAuthenticatedOnResource("7f2734cf-9283-4568-94d1-8903354ca382"),
        ],
      }),
      jaenPublish: withContext(Resource.jaenPublish, {
        decorators: [isAuthenticated],
      }),
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
        res.setHeader("Authorization", ["1", "2"]);

        res.send("Hello World!");
      });

      return app;
    },
  }
);
