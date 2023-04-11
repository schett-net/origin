import { Context, withContext } from "@snek-at/function";
import { GraphQLError } from "graphql";

import { sqIAM } from "../clients/iam/src";

export class Resource {
  static resource = withContext((context) => async (id: string) => {
    const [resource, errors] = await sqIAM.query(
      (Query) => {
        const r = Query.resource({ id });

        return {
          id: r?.id,
          name: r.name,
        };
      },
      {
        headers: {
          Authorization: context.req.headers.authorization,
        },
      }
    );

    if (errors) {
      throw new GraphQLError(errors[0].message, {
        extensions: errors[0].extensions,
      });
    }

    return new Resource(context, resource);
  });

  #context: Context;

  id: string;
  name: string;

  constructor(context: Context, data: { id: string; name: string }) {
    this.#context = context;

    for (const key in data) {
      this[key] = data[key];
    }
  }

  /**
   * Authorization required
   */
  async config(): Promise<Record<string, any>> {
    const [config, errors] = await sqIAM.query(
      (Query) => {
        const c = Query.resource({ id: this.id }).config;

        return c.value;
      },
      {
        headers: {
          Authorization: this.#context.req.headers.authorization,
        },
      }
    );

    if (errors) {
      throw new GraphQLError(errors[0].message, {
        extensions: errors[0].extensions,
      });
    }

    return config;
  }

  async secret(name: string) {
    const [secret, errors] = await sqIAM.query(
      (Query) => {
        const s = Query.resource({ id: this.id }).secret({ name });

        return {
          name: s.name,
          value: s.value,
        };
      },
      {
        headers: {
          Authorization: this.#context.req.headers.authorization,
        },
      }
    );

    if (errors) {
      throw new GraphQLError(errors[0].message, {
        extensions: errors[0].extensions,
      });
    }

    return secret;
  }
}
