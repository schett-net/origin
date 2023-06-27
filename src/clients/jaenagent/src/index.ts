import { makeSnekQuery } from "snek-query";
import { Query, Mutation } from "./schema.generated.js";

const apiURL =
  process.env.NODE_ENV === "production"
    ? "http://jaenagent:3000/graphql"
    : "https://services.snek.at/jaenagent/graphql";

export const sqJaenAgent = makeSnekQuery(
  { Query, Mutation },
  {
    apiURL,
  }
);
