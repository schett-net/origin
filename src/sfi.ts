import { defineService } from "@snek-at/function";
import bodyParser from "body-parser";

import { Jaen } from "./controller/Jaen";
import { Mailpress } from "./controller/Mailpress";
import { Resource } from "./controller/Resource";
import { Shopify } from "./controller/Shopify";
import { User } from "./controller/User";
import { Webhook } from "./controller/Webhook";

import { configureOAuth } from "./oauth";

export default defineService(
  {
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
      userExternalCredentialCreate: User.externalCredentialCreate,
      jaenPublish: Jaen.publish,
      shopifyProductCreate: Shopify.productCreate,
      shopifyProductUpdate: Shopify.productUpdate,
      shopifyProductDelete: Shopify.productDelete,
      mailpressMailSchedule: Mailpress.mailSchedule,
    },
  },
  {
    configureApp: (app) => {
      app.use(
        "/webhooks/shopify_jaen_publish/:resourceId",
        bodyParser.raw({ type: "application/json" })
      );

      //webhooks
      app.post(
        "/webhooks/shopify_jaen_publish/:resourceId",
        async (req, res) => {
          console.log(req.body);

          await Webhook.processRequest({ req, res });
        }
      );

      configureOAuth(app);
    },
  }
);
