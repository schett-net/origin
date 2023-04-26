import crypto from "crypto";
import { bindWithContext } from "@snek-at/function";
import { Jaen } from "./Jaen";

export class Webhook {
  static processRequest = async ({ req, res }) => {
    const resourceId = req.params.resourceId as string | undefined;

    console.log("resourceId", resourceId);

    if (!resourceId || typeof resourceId !== "string") {
      res.status(400).send("Resource ID is missing or not a string");
      return;
    }

    const secretsString = process.env.SHOPIFY_WEBHOOK_SECRET;

    if (!secretsString) {
      res.status(400).send("Webhook secrets are missing");
      return;
    }

    const secretsArray = secretsString.split(",") as string[];
    const secret = secretsArray.find((s) => s.startsWith(`${resourceId}:`));

    if (!secret) {
      res
        .status(400)
        .send("Webhook secret is missing for the provided resource ID");
      return;
    }

    const [signatureSecret, authorization] = secret.split(":").slice(1);

    const webhookSignature = req.headers["x-shopify-hmac-sha256"];

    const webhookBody = req.body;

    console.log("Webhook signature:", webhookSignature);
    console.log("Webhook body:", webhookBody);

    try {
      const calculatedSignature = crypto
        .createHmac("sha256", signatureSecret)
        .update(webhookBody)
        .digest("base64");

      if (calculatedSignature !== webhookSignature) {
        res.status(400).send("Webhook signature verification failed");
        return;
      }

      req.headers.authorization = authorization;

      console.log("req.headers.authorization", req.headers.authorization);

      console.log("Webhook signature verification successful");

      const publish = bindWithContext({ req, res }, Jaen.publish);

      console.log("Publishing...");

      await publish(resourceId, "");

      res.status(200).send("OK");
    } catch (error) {
      console.error("Error processing webhook request:", error);
      res.status(500).send("Internal server error");
    }
  };
}
