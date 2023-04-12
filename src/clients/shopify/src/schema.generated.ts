
import { proxy, arrayProxy, fnProxy, fnArrayProxy, t } from "snek-query";


type ShopifyIdInput = {
    storeUrl: t.String;
    accessToken: t.String;
};
type ShopifyProductInputInput = {
    handle?: t.String;
    title: t.String;
    descriptionHtml?: t.String;
    metafields?: MetafieldsInput[];
    productType?: t.String;
    tags?: t.String[];
    variants?: VariantsInput;
    vendor?: t.String;
};
type MetafieldsInput = {
    namespace: t.String;
    key: t.String;
    value: t.String;
    type: t.String;
};
type VariantsInput = {
    price?: t.String;
    compareAtPrice?: t.String;
    sku?: t.String;
    taxable?: t.Boolean;
    inventoryPolicy?: t.String;
    inventoryItem?: InventoryItemInput;
};
type InventoryItemInput = {
    tracked?: t.Boolean;
};
type UpdateShopifyProductInputInput = {
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
type MetafieldsInput_1 = {
    namespace: t.String;
    key: t.String;
    value: t.String;
    type: t.String;
};
type VariantsInput_1 = {
    price?: t.String;
    compareAtPrice?: t.String;
    sku?: t.String;
    taxable?: t.Boolean;
    inventoryPolicy?: t.String;
    inventoryItem?: InventoryItemInput_1;
};
type InventoryItemInput_1 = {
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

