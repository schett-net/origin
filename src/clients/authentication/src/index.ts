import { makeSnekQuery } from "snek-query";
import { Query, Mutation } from "./schema.generated.js";

export const sqAuthentication = makeSnekQuery(
  { Query, Mutation },
  {
    apiURL: "https://services.snek.at/authentication/graphql",
  }
);
