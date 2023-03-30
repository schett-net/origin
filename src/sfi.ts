import { defineService, withContext } from "@snek-at/function";
import { anyLoginRequired, loginRequired } from "@snek-functions/jwt";
import { sqIAM } from "./clients/iam";

import { Resource } from "./controller/Resource";
import { User } from "./controller/User";

export default defineService({
  Query: {
    userMe: withContext(User.me, {
      decorators: [anyLoginRequired],
    }),
    resource: withContext(Resource.resource),
  },
  Mutation: {
    userSignIn: withContext(User.signIn),
    userSignOut: withContext(User.signOut),
    userRefresh: withContext(User.refresh),
    userSSO: withContext(User.ssoSignIn, {
      decorators: [anyLoginRequired],
    }),
    resourceJaenPublish: withContext(Resource.jaenPublish, {
      decorators: [loginRequired],
    }),
    userRegister: withContext(User.register),
  },
});
