import { Context, bindWithContext, withContext } from "@snek-at/function";
import { GraphQLError } from "graphql";
import { requireAdminForResource } from "@snek-functions/jwt";

import { sqShopify } from "../clients/shopify/src";
import { Resource } from "./Resource";
import { ConfigNotFoundError, ConfigValueNotFoundError } from "../errors";

interface ShopifyProductCreate {
  handle?: string;
  title: string;
  descriptionHtml?: string;
  metafields?: {
    namespace: string;
    key: string;
    value: string;
    type: string;
  }[];
  productType?: string;
  tags?: string[];
  variants?: {
    price?: string;
    compareAtPrice?: string;
    sku?: string;
    taxable?: boolean;
    inventoryPolicy?: string;
    inventoryItem?: {
      tracked?: boolean;
    };
  };
  vendor?: string;
}

interface ShopifyProductUpdate {
  id: string;
  // rest optional
  handle?: string;
  title?: string;
  descriptionHtml?: string;
  metafields?: {
    namespace: string;
    key: string;
    value: string;
    type: string;
  }[];
  productType?: string;
  tags?: string[];
  variants?: {
    price?: string;
    compareAtPrice?: string;
    sku?: string;
    taxable?: boolean;
    inventoryPolicy?: string;
    inventoryItem?: {
      tracked?: boolean;
    };
  };
  vendor?: string;
}

export class Shopify {
  private static getResourceShopifyConfig =
    (context: Context) => async (resourceId: string) => {
      const resource = await bindWithContext(
        context,
        Resource.resource
      )(resourceId);

      const config = await resource.config();

      const shopifyConfig = config.shopify;

      if (!shopifyConfig) {
        throw new ConfigNotFoundError("No `shopify` config found");
      }

      const storeUrl = shopifyConfig.storeUrl;

      if (!storeUrl) {
        throw new ConfigValueNotFoundError("No `storeUrl` found");
      }

      const accessTokenSecret = await resource.secret("SHOPIFY_ACCESS_TOKEN");

      if (!accessTokenSecret) {
        throw new ConfigValueNotFoundError("No `SHOPIFY_ACCESS_TOKEN` found");
      }

      const accessToken = accessTokenSecret.value;

      return {
        storeUrl,
        accessToken,
      };
    };

  static allProductId = withContext(
    (context) => async (resourceId: string) => {
      const { storeUrl, accessToken } = await Shopify.getResourceShopifyConfig(
        context
      )(resourceId);

      const [data, errors] = await sqShopify.query((Query) => {
        const ids = Query.allProductId({
          id: {
            storeUrl,
            accessToken,
          },
        });

        return ids.map((id) => id);
      });

      if (errors) {
        throw new GraphQLError(errors[0].message, {
          extensions: errors[0].extensions,
        });
      }

      return data;
    },
    {
      decorators: [requireAdminForResource],
    }
  );

  static productCreate = withContext(
    (context) => async (resourceId: string, input: ShopifyProductCreate) => {
      const { storeUrl, accessToken } = await Shopify.getResourceShopifyConfig(
        context
      )(resourceId);

      const [data, errors] = await sqShopify.mutate((Mutation) => {
        return Mutation.productCreate({
          id: {
            storeUrl,
            accessToken,
          },
          product: input,
        });
      });

      if (errors) {
        throw new GraphQLError(errors[0].message, {
          extensions: errors[0].extensions,
        });
      }

      return data;
    },
    {
      decorators: [requireAdminForResource],
    }
  );

  static productUpdate = withContext(
    (context) => async (resourceId: string, input: ShopifyProductUpdate) => {
      const { storeUrl, accessToken } = await Shopify.getResourceShopifyConfig(
        context
      )(resourceId);

      const [data, errors] = await sqShopify.mutate((Mutation) => {
        return Mutation.productUpdate({
          id: {
            storeUrl,
            accessToken,
          },
          product: input,
        });
      });

      if (errors) {
        throw new GraphQLError(errors[0].message, {
          extensions: errors[0].extensions,
        });
      }

      return data;
    },
    {
      decorators: [requireAdminForResource],
    }
  );

  static productDelete = withContext(
    (context) => async (resourceId: string, id: string) => {
      const { storeUrl, accessToken } = await Shopify.getResourceShopifyConfig(
        context
      )(resourceId);

      const [data, errors] = await sqShopify.mutate((Mutation) => {
        return Mutation.productDelete({
          id: {
            storeUrl,
            accessToken,
          },
          productId: id,
        });
      });

      if (errors) {
        throw new GraphQLError(errors[0].message, {
          extensions: errors[0].extensions,
        });
      }

      return data;
    }
  );
}
