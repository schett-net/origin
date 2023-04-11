import { defineService } from "@snek-at/function";

import { Resource } from "./controller/Resource";
import { User } from "./controller/User";
import { Jaen } from "./controller/Jaen";

export default defineService({
  Query: {
    userMe: User.me,
    resource: Resource.resource,
  },
  Mutation: {
    userSignIn: User.signIn,
    userSignOut: User.signOut,
    userRefresh: User.refresh,
    userSSO: User.ssoSignIn,
    jaenPublish: Jaen.publish,
    userRegister: User.register,
    userEmailCreate: User.emailCreate,
    userEmailUpdate: User.emailUpdate,
    userEmailDelete: User.emailDelete,
  },
});
