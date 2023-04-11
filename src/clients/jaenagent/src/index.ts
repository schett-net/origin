import { makeSnekQuery } from "snek-query";
import { Query, Mutation } from "./schema.generated.js";

export const sqJaenAgent = makeSnekQuery(
  { Query, Mutation },
  {
    apiURL: "https://services.snek.at/jaenagent/graphql",
  }
);
