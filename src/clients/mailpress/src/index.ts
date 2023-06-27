import { makeSnekQuery } from "snek-query";
import { Query, Mutation } from "./schema.generated.js";

const apiURL =
  process.env.NODE_ENV === "production"
    ? "http://mailpress:3000/graphql"
    : "https://services.snek.at/mailpress/graphql";

export const sqMailpress = makeSnekQuery(
  { Query, Mutation },
  {
    apiURL,
  }
);
