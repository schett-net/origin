import { makeSnekQuery } from "snek-query";
import { Query, Mutation } from "./schema.generated.js";

const serviceName = "jaenagent";

const apiURL =
  process.env.NODE_ENV === "production"
    ? `http://${serviceName}:3000/graphql`
    : `https://services.snek.at/${serviceName}/graphql`;

export const sqJaenAgent = makeSnekQuery(
  { Query, Mutation },
  {
    apiURL,
  }
);
