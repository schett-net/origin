import { defineService } from "@snek-at/function";

import { Resource } from "./controller/Resource";
import { User } from "./controller/User";
import { Jaen } from "./controller/Jaen";
import { Shopify } from "./controller/Shopify";

export default defineService({
  Query: {
    user: User.user,
    allUser: User.users,
    userMe: User.me,
    resource: Resource.resource,
    shopifyAllProductId: Shopify.allProductId,
  },
  Mutation: {
    userSignIn: User.signIn,
    userSignOut: User.signOut,
    userRefresh: User.refresh,
    userSSO: User.ssoSignIn,
    userRegister: User.register,
    userUpdate: User.update,
    userDelete: User.delete,
    userEmailCreate: User.emailCreate,
    userEmailUpdate: User.emailUpdate,
    userEmailDelete: User.emailDelete,
    jaenPublish: Jaen.publish,
    shopifyProductCreate: Shopify.productCreate,
    shopifyProductUpdate: Shopify.productUpdate,
    shopifyProductDelete: Shopify.productDelete,
  },
});
