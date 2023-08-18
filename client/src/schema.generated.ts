
import { proxy, arrayProxy, fnProxy, fnArrayProxy, t } from "snek-query";

enum OAuthProvider {
    google = "google",
    azure = "azure"
}
enum OAuthProviderInputInput {
    google = "google",
    azure = "azure"
}
enum EmailAddressTypeInputInput {
    EMAIL_ADDRESS = "EMAIL_ADDRESS",
    EMAIL_ID = "EMAIL_ID",
    USER_ID = "USER_ID"
}

type ValuesInputInput = {
    emailAddress: t.String;
    username: t.String;
    password: t.String;
    accountId?: t.String;
    isActive?: t.Boolean;
    isAdmin?: t.Boolean;
    details?: DetailsInputInput;
};
type DetailsInputInput = {
    firstName?: t.String;
    lastName?: t.String;
};
type ValuesInput_1Input = {
    username?: t.String;
    password?: t.String;
    isActive?: t.Boolean;
    isAdmin?: t.Boolean;
    details?: DetailsInput_1Input;
};
type DetailsInput_1Input = {
    firstName?: t.String;
    lastName?: t.String;
    avatarFile: t.NotSupportedYet;
};
type EmailConfigCreateInputInput = {
    externalCredentialId: t.String;
    isEnabled?: t.Boolean;
};
type ValuesInput_1_2Input = {
    emailAddress?: t.String;
    isPrimary?: t.Boolean;
    config?: EmailConfigUpdateInputInput;
};
type EmailConfigUpdateInputInput = {
    externalCredentialId?: t.String;
    isEnabled?: t.Boolean;
};
type SMTPCredentialInputInput = {
    host: t.String;
    port: t.NotSupportedYet;
    username: t.String;
    password: t.String;
    secure: t.Boolean;
};
type OAuthCredentialInputInput = {
    provider: OAuthProviderInputInput;
    accessToken: t.String;
    refreshToken: t.String;
};
type ShopifyProductCreateInput = {
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
type EmailEnvelopeInputInput = {
    from?: EmailAddressInputInput;
    to?: EmailAddressInputInput[];
    subject?: t.String;
    replyTo?: EmailAddressInputInput;
};
type EmailAddressInputInput = {
    value: t.String;
    type: EmailAddressTypeInputInput;
};
type TemplateInputInput = {
    id: t.String;
    values: t.NotSupportedYet;
};

export class Query {
    __typename: t.String;
    user: (args: {
        id: t.String;
    }) => User;
    allUser: (args: {
        resourceId: t.String;
    }) => User[];
    userMe: User;
    resource: (args: {
        id: t.String;
    }) => Resource;
    shopifyAllProductId: (args: {
        resourceId: t.String;
    }) => t.String[];
    version: t.String;
    constructor() { this.__typename = ""; this.user = fnProxy(User); this.allUser = fnArrayProxy(User); this.userMe = proxy(User); this.resource = fnProxy(Resource); this.shopifyAllProductId = () => []; this.version = ""; }
}
export class User {
    __typename: t.String;
    id: t.String;
    username: t.String;
    primaryEmailAddress: t.String;
    isAdmin: t.Boolean;
    isActive: t.Boolean;
    createdAt: t.String;
    details: Details;
    resource: Resource;
    emails: UserEmail[];
    constructor() { this.__typename = ""; this.id = ""; this.username = ""; this.primaryEmailAddress = ""; this.isAdmin = false; this.isActive = false; this.createdAt = ""; this.details = proxy(Details); this.resource = proxy(Resource); this.emails = arrayProxy(UserEmail); }
}
export class Details {
    __typename: t.String;
    firstName: t.Nullable<t.String>;
    lastName: t.Nullable<t.String>;
    avatarURL: t.Nullable<t.String>;
    constructor() { this.__typename = ""; this.firstName = null; this.lastName = null; this.avatarURL = null; }
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
    config: t.Nullable<EmailConfig>;
    constructor() { this.__typename = ""; this.id = ""; this.emailAddress = ""; this.isPrimary = false; this.config = proxy(EmailConfig); }
}
export class EmailConfig {
    __typename: t.String;
    id: t.String;
    isEnabled: t.Boolean;
    externalCredential: t.Nullable<ExternalCredential>;
    constructor() { this.__typename = ""; this.id = ""; this.isEnabled = false; this.externalCredential = proxy(ExternalCredential); }
}
export class ExternalCredential {
    __typename: t.String;
    smtp: t.Nullable<SMTPCredential>;
    oauth: t.Nullable<OAuthCredential>;
    constructor() { this.__typename = ""; this.smtp = proxy(SMTPCredential); this.oauth = proxy(OAuthCredential); }
}
export class SMTPCredential {
    __typename: t.String;
    host: t.String;
    port: t.NotSupportedYet;
    username: t.String;
    password: t.String;
    secure: t.Boolean;
    constructor() { this.__typename = ""; this.host = ""; this.port = null; this.username = ""; this.password = ""; this.secure = false; }
}
export class OAuthCredential {
    __typename: t.String;
    provider: t.Nullable<OAuthProvider>;
    accessToken: t.String;
    refreshToken: t.String;
    constructor() { this.__typename = ""; this.provider = null; this.accessToken = ""; this.refreshToken = ""; }
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
    userUpdate: (args: {
        id: t.String;
        values: ValuesInput_1Input;
    }) => User;
    userDelete: (args: {
        id: t.String;
    }) => t.Boolean;
    userEmailCreate: (args: {
        emailAddress: t.String;
        isPrimary?: t.Boolean;
        config?: EmailConfigCreateInputInput;
    }) => UserEmail;
    userEmailUpdate: (args: {
        emailId: t.String;
        values: ValuesInput_1_2Input;
    }) => UserEmail;
    userEmailDelete: (args: {
        emailId: t.String;
    }) => t.Boolean;
    userExternalCredentialCreate: (args?: {
        smtp?: SMTPCredentialInputInput;
        oauth?: OAuthCredentialInputInput;
    }) => t.String;
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
    mailpressMailSchedule: (args: {
        envelope: EmailEnvelopeInputInput;
        body?: t.String;
        bodyHTML?: t.String;
        template?: TemplateInputInput;
    }) => t.String;
    constructor() { this.__typename = ""; this.userSignIn = fnProxy(UserSignIn); this.userSignOut = () => null; this.userRefresh = fnProxy(UserRefresh); this.userSSO = fnProxy(UserSSO); this.userRegister = fnProxy(UserRegister); this.userUpdate = fnProxy(User); this.userDelete = () => false; this.userEmailCreate = fnProxy(UserEmail); this.userEmailUpdate = fnProxy(UserEmail); this.userEmailDelete = () => false; this.userExternalCredentialCreate = () => ""; this.jaenPublish = () => ""; this.shopifyProductCreate = () => ""; this.shopifyProductUpdate = () => ""; this.shopifyProductDelete = () => ""; this.mailpressMailSchedule = () => ""; }
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

