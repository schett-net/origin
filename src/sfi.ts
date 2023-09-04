import { defineService, logger } from "@snek-at/function";
import bodyParser from "body-parser";

import { Jaen } from "./controller/Jaen";
import { Mailpress } from "./controller/Mailpress";
import { Resource } from "./controller/Resource";
import { Shopify } from "./controller/Shopify";
import { User } from "./controller/User";
import { Webhook } from "./controller/Webhook";

import { configureOAuth } from "./oauth";
import { UserEmail } from "./controller/Email";
import { SocialController } from "./controller/Social";

export default defineService(
  {
    Query: {
      user: User.user,
      allUser: User.users,

      userMe: User.me,
      resource: Resource.resource,
      shopifyAllProductId: Shopify.allProductId,

      socialProfile: SocialController.socialProfile,
      allSocialProfile: SocialController.allSocialProfile,

      socialPost: SocialController.socialPost,
      allSocialPost: SocialController.allSocialPost,
      allSocialPostTrending: SocialController.allSocialPostTrending,
    },
    Mutation: {
      passwordReset: User.passwordReset,
      passwordResetConfirm: User.passwordResetConfirm,

      userSignIn: User.signIn,
      userSignOut: User.signOut,
      userRefresh: User.refresh,
      userSSO: User.ssoSignIn,
      userRegister: User.register,
      userUpdate: User.update,
      userDelete: User.delete,

      userEmailCreate: User.emailCreate,
      userEmailConfirm: UserEmail.confirm,
      userEmailConfirmationResend: User.userEmailConfirmationResend,
      userEmailUpdate: User.emailUpdate,
      userEmailDelete: User.emailDelete,
      userExternalCredentialCreate: User.externalCredentialCreate,
      jaenPublish: Jaen.publish,
      shopifyProductCreate: Shopify.productCreate,
      shopifyProductUpdate: Shopify.productUpdate,
      shopifyProductDelete: Shopify.productDelete,
      mailpressMailSchedule: Mailpress.mailSchedule,

      socialProfileCreate: SocialController.socialProfileCreate,
      socialProfileUpdate: SocialController.socialProfileUpdate,
      socialProfileDelete: SocialController.socialProfileDelete,

      socialProfileFollow: SocialController.socialProfileFollow,
      socialProfileUnfollow: SocialController.socialProfileUnfollow,

      socialPostCreate: SocialController.socialPostCreate,
      socialPostUpdate: SocialController.socialPostUpdate,
      socialPostDelete: SocialController.socialPostDelete,

      socialPostStar: SocialController.socialPostStar,
      socialPostUnstar: SocialController.socialPostUnstar,
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

      app.get("/graphql_b64", async (req, res) => {
        console.log(req.query);

        console.log("query", req.query.query, !!req.query.query);

        if (!req.query.query) {
          return res.status(400).send("Missing query parameter");
        }

        const query = Buffer.from(req.query.query as string, "base64").toString(
          "utf-8"
        );

        // get the endpoint on which this express app is running

        const endpoint = `http://localhost:3000/graphql`;

        // send the request to the graphql endpoint

        logger.info(`Sending request to ${endpoint} with ${query}`);

        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query,
            }),
          });

          console.log(response);

          // parse the response as json
          const { data, errors } = await response.json();

          console.log("json", data, errors);

          const redirect_error = req.query.redirect_error
            ? decodeURIComponent(req.query.redirect_error as string)
            : undefined;

          const redirect_success = req.query.redirect_success
            ? decodeURIComponent(req.query.redirect_success as string)
            : undefined;

          if (errors) {
            if (redirect_error) {
              // redirect to the error page
              res.redirect(
                `${redirect_error}?error=${encodeURIComponent(
                  JSON.stringify(errors)
                )}`
              );
            }
          }

          if (data) {
            if (redirect_success) {
              // redirect to the success page
              res.redirect(
                `${redirect_success}?data=${encodeURIComponent(
                  JSON.stringify(data)
                )}`
              );
            }
          }

          // send the response as json
          res.json({ data, errors });
        } catch (error) {
          console.log({
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query,
            }),
          });
          logger.error(error);
          res.status(500).json({ error });
        }
      });

      configureOAuth(app);
    },
  }
);
