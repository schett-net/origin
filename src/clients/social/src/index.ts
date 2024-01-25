import { makeSnekQuery } from "snek-query";
import { Query, Mutation } from "./schema.generated.js";

const serviceName = "social";

export const apiURL =
  process.env.NODE_ENV === "production"
    ? `http://${serviceName}:3000/graphql`
    : `https://services.snek.at/${serviceName}/graphql`;

export const sq = makeSnekQuery(
  { Query, Mutation },
  {
    apiURL,
  }
);
