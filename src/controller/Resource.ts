import { Context } from "@snek-at/function";
import { sqIAM } from "../clients/iam";
import { isAuthenticatedOnResource } from "../decorators/auth";
import AuthUtils from "../utils/AuthUtils";

export class Resource {
  static async resource(id: string) {
    const [resource, errors] = await sqIAM.query((Query) => {
      const r = Query.resource({ id });

      return {
        id: r?.id,
        name: r.name,
      };
    });

    if (errors) {
      throw new Error(errors[0].message);
    }

    return new Resource(resource.id, resource.name);
  }

  static resourceSignIn = (context: Context) => async (id: string) => {
    /**
     * This decorator checks if the user is authenticated on the resource (Snek Access).
     * If so, the user is allowed to sign in to a resource directly without having to
     * authenticate on the resource first.
     */
    const state = isAuthenticatedOnResource(
      "7f2734cf-9283-4568-94d1-8903354ca382"
    )(context);

    const authUtils = new AuthUtils(context);

    return false;
  };

  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
