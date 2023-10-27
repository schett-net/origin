
import { proxy, arrayProxy, fnProxy, fnArrayProxy, t } from "snek-query";


export type ShopifyIdInput = {
    storeUrl: t.String;
    accessToken: t.String;
};
export type ShopifyProductInputInput = {
    handle?: t.String;
    title: t.String;
    descriptionHtml?: t.String;
    metafields?: MetafieldsInput[];
    productType?: t.String;
    tags?: t.String[];
    variants?: VariantsInput;
    vendor?: t.String;
};
export type MetafieldsInput = {
    namespace: t.String;
    key: t.String;
    value: t.String;
    type: t.String;
};
export type VariantsInput = {
    price?: t.String;
    compareAtPrice?: t.String;
    sku?: t.String;
    taxable?: t.Boolean;
    inventoryPolicy?: t.String;
    inventoryItem?: InventoryItemInput;
};
export type InventoryItemInput = {
    tracked?: t.Boolean;
};
export type UpdateShopifyProductInputInput = {
    id: t.String;
    handle?: t.String;
    title?: t.String;
    descriptionHtml?: t.String;
    metafields?: MetafieldsInput_1[];
    productType?: t.String;
    tags?: t.String[];
    variants?: VariantsInput_1;
    vendor?: t.String;
};
export type MetafieldsInput_1 = {
    namespace: t.String;
    key: t.String;
    value: t.String;
    type: t.String;
};
export type VariantsInput_1 = {
    price?: t.String;
    compareAtPrice?: t.String;
    sku?: t.String;
    taxable?: t.Boolean;
    inventoryPolicy?: t.String;
    inventoryItem?: InventoryItemInput_1;
};
export type InventoryItemInput_1 = {
    tracked?: t.Boolean;
};

export class Query {
    __typename: t.String;
    allProductId: (args: {
        id: ShopifyIdInput;
    }) => t.String[];
    version: t.String;
    constructor() { this.__typename = ""; this.allProductId = () => []; this.version = ""; }
}
export class Mutation {
    __typename: t.String;
    productCreate: (args: {
        id: ShopifyIdInput;
        product: ShopifyProductInputInput;
    }) => t.String;
    productDelete: (args: {
        id: ShopifyIdInput;
        productId: t.String;
    }) => t.String;
    productUpdate: (args: {
        id: ShopifyIdInput;
        product: UpdateShopifyProductInputInput;
    }) => t.String;
    constructor() { this.__typename = ""; this.productCreate = () => ""; this.productDelete = () => ""; this.productUpdate = () => ""; }
}

