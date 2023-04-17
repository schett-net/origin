import { makeSnekQuery } from "snek-query";
import { Query, Mutation } from "./schema.generated.js";

export const sqMailpress = makeSnekQuery(
  { Query, Mutation },
  {
    apiURL: "https://services.snek.at/mailpress/graphql",
  }
);
