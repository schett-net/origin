import { Application } from "@snek-at/function/dist/defineService";
import { createProxyMiddleware } from "http-proxy-middleware";

// Create an instance of http-proxy-middleware and name it iamProxy
const iamProxy = createProxyMiddleware({
  target: "http://iam:3000", // replace with the URL of the server you want to forward to
  changeOrigin: true, // needed for virtual hosted sites
});

export function configureOAuth(app: Application) {
  // Forward "/oauth/azure" route to the other server using iamProxy
  app.get("/oauth/azure", iamProxy);

  // Forward "/oauth/azure/callback" route to the other server using iamProxy
  app.get("/oauth/azure/callback", iamProxy);

  // Forward "/oauth/google" route to the other server using iamProxy
  app.get("/oauth/google", iamProxy);

  // Forward "/oauth/google/callback" route to the other server using iamProxy
  app.get("/oauth/google/callback", iamProxy);
}
