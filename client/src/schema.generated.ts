
import { proxy, arrayProxy, fnProxy, fnArrayProxy, t } from "snek-query";


type ValuesInputInput = {
    emailAddress: t.String;
    username: t.String;
    password: t.String;
    accountId?: t.String;
    isActive?: t.Boolean;
};
type EmailConfigurationInputInput = {
    smtpHost: t.String;
    smtpPort: t.NotSupportedYet;
    secure: t.Boolean;
    username: t.String;
    password: t.String;
    isEnabled: t.Boolean;
};
type ValuesInput_1_2Input = {
    emailAddress?: t.String;
    isPrimary?: t.Boolean;
    emailConfiguration?: EmailConfigurationInputInput;
};
type ShopifyProductCreateInput = {
    handle: t.String;
    title: t.String;
    descriptionHtml: t.String;
    metafields: MetafieldsInput[];
    productType: t.String;
    tags: t.String[];
    variants: VariantsInput;
    vendor: t.String;
};
type MetafieldsInput = {
    namespace: t.String;
    key: t.String;
    value: t.String;
    type: t.String;
};
type VariantsInput = {
    price: t.String;
    compareAtPrice: t.String;
    sku: t.String;
    taxable: t.Boolean;
};
type ShopifyProductUpdateInput = {
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
    price: t.String;
    compareAtPrice: t.String;
    sku: t.String;
    taxable: t.Boolean;
};

export class Query {
    __typename: t.String;
    userMe: User;
    resource: (args: {
        id: t.String;
    }) => Resource;
    shopifyAllProductId: (args: {
        resourceId: t.String;
    }) => t.String[];
    version: t.String;
    constructor() { this.__typename = ""; this.userMe = proxy(User); this.resource = fnProxy(Resource); this.shopifyAllProductId = () => []; this.version = ""; }
}
export class User {
    __typename: t.String;
    id: t.String;
    username: t.String;
    primaryEmailAddress: t.String;
    isAdmin: t.Boolean;
    resource: Resource;
    emails: UserEmail[];
    constructor() { this.__typename = ""; this.id = ""; this.username = ""; this.primaryEmailAddress = ""; this.isAdmin = false; this.resource = proxy(Resource); this.emails = arrayProxy(UserEmail); }
}
export class Resource {
    __typename: t.String;
    id: t.String;
    name: t.String;
    config: t.NotSupportedYet;
    secret: (args: {
        name: t.String;
    }) => Secret;
    constructor() { this.__typename = ""; this.id = ""; this.name = ""; this.config = null; this.secret = fnProxy(Secret); }
}
export class Secret {
    __typename: t.String;
    name: t.String;
    value: t.NotSupportedYet;
    constructor() { this.__typename = ""; this.name = ""; this.value = null; }
}
export class UserEmail {
    __typename: t.String;
    id: t.String;
    emailAddress: t.String;
    isPrimary: t.Boolean;
    emailConfiguration: t.Nullable<EmailConfiguration>;
    constructor() { this.__typename = ""; this.id = ""; this.emailAddress = ""; this.isPrimary = false; this.emailConfiguration = proxy(EmailConfiguration); }
}
export class EmailConfiguration {
    __typename: t.String;
    smtpHost: t.String;
    smtpPort: t.NotSupportedYet;
    secure: t.Boolean;
    username: t.String;
    password: t.String;
    isEnabled: t.Boolean;
    constructor() { this.__typename = ""; this.smtpHost = ""; this.smtpPort = null; this.secure = false; this.username = ""; this.password = ""; this.isEnabled = false; }
}
export class Mutation {
    __typename: t.String;
    userSignIn: (args: {
        login: t.String;
        password: t.String;
        resourceId: t.String;
    }) => UserSignIn;
    userSignOut: (args?: {
        resourceId?: t.String;
    }) => t.NotSupportedYet;
    userRefresh: (args: {
        accessToken: t.String;
        refreshToken: t.String;
    }) => UserRefresh;
    userSSO: (args: {
        resourceId: t.String;
    }) => UserSSO;
    userRegister: (args: {
        resourceId: t.String;
        values: ValuesInputInput;
        skipEmailVerification?: t.Boolean;
    }) => UserRegister;
    userEmailCreate: (args: {
        emailAddress: t.String;
        isPrimary?: t.Boolean;
        emailConfiguration?: EmailConfigurationInputInput;
    }) => UserEmail;
    userEmailUpdate: (args: {
        emailId: t.String;
        values: ValuesInput_1_2Input;
    }) => UserEmail;
    userEmailDelete: (args: {
        emailId: t.String;
    }) => t.Boolean;
    jaenPublish: (args: {
        resourceId: t.String;
        migrationURL: t.String;
    }) => t.String;
    shopifyProductCreate: (args: {
        resourceId: t.String;
        input: ShopifyProductCreateInput;
    }) => t.String;
    shopifyProductUpdate: (args: {
        resourceId: t.String;
        input: ShopifyProductUpdateInput;
    }) => t.String;
    shopifyProductDelete: (args: {
        resourceId: t.String;
        id: t.String;
    }) => t.String;
    constructor() { this.__typename = ""; this.userSignIn = fnProxy(UserSignIn); this.userSignOut = () => null; this.userRefresh = fnProxy(UserRefresh); this.userSSO = fnProxy(UserSSO); this.userRegister = fnProxy(UserRegister); this.userEmailCreate = fnProxy(UserEmail); this.userEmailUpdate = fnProxy(UserEmail); this.userEmailDelete = () => false; this.jaenPublish = () => ""; this.shopifyProductCreate = () => ""; this.shopifyProductUpdate = () => ""; this.shopifyProductDelete = () => ""; }
}
export class UserSignIn {
    __typename: t.String;
    tokenPair: TokenPair;
    user: User;
    me: User;
    constructor() { this.__typename = ""; this.tokenPair = proxy(TokenPair); this.user = proxy(User); this.me = proxy(User); }
}
export class TokenPair {
    __typename: t.String;
    accessToken: t.String;
    refreshToken: t.String;
    constructor() { this.__typename = ""; this.accessToken = ""; this.refreshToken = ""; }
}
export class UserRefresh {
    __typename: t.String;
    tokenPair: TokenPair;
    me: User;
    constructor() { this.__typename = ""; this.tokenPair = proxy(TokenPair); this.me = proxy(User); }
}
export class UserSSO {
    __typename: t.String;
    tokenPair: TokenPair;
    user: User;
    me: User;
    constructor() { this.__typename = ""; this.tokenPair = proxy(TokenPair); this.user = proxy(User); this.me = proxy(User); }
}
export class UserRegister {
    __typename: t.String;
    user: User;
    accessToken: t.String;
    constructor() { this.__typename = ""; this.user = proxy(User); this.accessToken = ""; }
}

