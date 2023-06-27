import { makeSnekQuery } from "snek-query";
import { Query, Mutation } from "./schema.generated.js";

const apiURL =
  process.env.NODE_ENV === "production"
    ? "http://authentication:3000/graphql"
    : "https://services.snek.at/authentication/graphql";

export const sqAuthentication = makeSnekQuery(
  { Query, Mutation },
  {
    apiURL,
  }
);
