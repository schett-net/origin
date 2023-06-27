import { makeSnekQuery } from "snek-query";
import { Query, Mutation } from "./schema.generated.js";

const apiURL =
  process.env.NODE_ENV === "production"
    ? "http://shopify:3000/graphql"
    : "https://services.snek.at/shopify/graphql";

export const sqShopify = makeSnekQuery(
  { Query, Mutation },
  {
    apiURL,
  }
);
