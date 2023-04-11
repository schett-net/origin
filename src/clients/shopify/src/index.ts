import { makeSnekQuery } from "snek-query";
import { Query, Mutation } from "./schema.generated.js";

export const sqShopify = makeSnekQuery(
  { Query, Mutation },
  {
    apiURL: "https://services.snek.at/shopify/graphql",
  }
);
