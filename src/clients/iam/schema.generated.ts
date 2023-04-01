
import { proxy, arrayProxy, fnProxy, fnArrayProxy, t } from "snek-query";

enum ACCESS_REFRESH {
    access = "access",
    refresh = "refresh"
}

type FilterInput = {
    resourceId?: t.String;
};
type FilterInput_1 = {
    ids?: t.String[];
    resourceId?: t.String;
    isActive?: t.Boolean;
    isAdmin?: t.Boolean;
};
type ValuesInput = {
    emailAddress: t.String;
    username: t.String;
    password: t.String;
    accountId?: t.String;
    isActive?: t.Boolean;
};
type ValuesInput_1 = {
    username?: t.String;
    password?: t.String;
    isActive?: t.Boolean;
    isAdmin?: t.Boolean;
    primaryEmailAddressId?: t.String;
};
type SecretInput = {
    scopeId: t.String;
    name: t.String;
    value: t.NotSupportedYet;
    expiresAt?: t.String;
};
type GenericObjectInput = {
    object: t.NotSupportedYet;
    expiresAt?: t.String;
    scopeId?: t.String;
    tag?: t.String;
};

export class Query {
    __typename: t.String;
    user: (args: {
        id: t.String;
        filter?: FilterInput;
    }) => User;
    allUser: (args?: {
        filter?: FilterInput_1;
    }) => User[];
    resource: (args: {
        id: t.String;
    }) => Resource;
    allResource: Resource[];
    userTokenVerify: (args: {
        token: t.String;
    }) => UserTokenPayload;
    version: t.String;
    constructor() { this.__typename = ""; this.user = fnProxy(User); this.allUser = fnArrayProxy(User); this.resource = fnProxy(Resource); this.allResource = arrayProxy(Resource); this.userTokenVerify = fnProxy(UserTokenPayload); this.version = ""; }
}
export class User {
    __typename: t.String;
    isActive: t.Boolean;
    id: t.String;
    username: t.String;
    resourceId: t.String;
    accountId: t.String;
    isAdmin: t.Boolean;
    passwordHash: t.String;
    primaryEmailAddressId: t.String;
    primaryEmailAddress: EmailAddress;
    emails: EmailAddress[];
    account: Account;
    resource: Resource;
    tokens: Token[];
    constructor() { this.__typename = ""; this.isActive = false; this.id = ""; this.username = ""; this.resourceId = ""; this.accountId = ""; this.isAdmin = false; this.passwordHash = ""; this.primaryEmailAddressId = ""; this.primaryEmailAddress = proxy(EmailAddress); this.emails = arrayProxy(EmailAddress); this.account = proxy(Account); this.resource = proxy(Resource); this.tokens = arrayProxy(Token); }
}
export class EmailAddress {
    __typename: t.String;
    id: t.String;
    emailAddress: t.String;
    resourceId: t.String;
    constructor() { this.__typename = ""; this.id = ""; this.emailAddress = ""; this.resourceId = ""; }
}
export class Account {
    __typename: t.String;
    id: t.String;
    emailAddressId: t.String;
    users: User[];
    constructor() { this.__typename = ""; this.id = ""; this.emailAddressId = ""; this.users = arrayProxy(User); }
}
export class Resource {
    __typename: t.String;
    id: t.String;
    name: t.String;
    users: User[];
    config: GenericObject;
    secrets: SecretObject[];
    secret: (args: {
        name: t.String;
    }) => SecretObject;
    constructor() { this.__typename = ""; this.id = ""; this.name = ""; this.users = arrayProxy(User); this.config = proxy(GenericObject); this.secrets = arrayProxy(SecretObject); this.secret = fnProxy(SecretObject); }
}
export class GenericObject {
    __typename: t.String;
    id: t.String;
    value: t.NotSupportedYet;
    tag: t.Nullable<t.String>;
    expiresAt: t.Nullable<t.String>;
    constructor() { this.__typename = ""; this.id = ""; this.value = null; this.tag = null; this.expiresAt = null; }
}
export class SecretObject {
    __typename: t.String;
    name: t.String;
    value: t.NotSupportedYet;
    expiresAt: t.Nullable<t.String>;
    constructor() { this.__typename = ""; this.name = ""; this.value = null; this.expiresAt = null; }
}
export class Token {
    __typename: t.String;
    id: t.String;
    name: t.String;
    expiresAt: t.Nullable<t.String>;
    constructor() { this.__typename = ""; this.id = ""; this.name = ""; this.expiresAt = null; }
}
export class UserTokenPayload {
    __typename: t.String;
    type: t.Nullable<ACCESS_REFRESH>;
    sub: t.String;
    resourceId: t.String;
    scope: t.NotSupportedYet;
    iat: t.NotSupportedYet;
    exp: t.NotSupportedYet;
    jti: t.String;
    constructor() { this.__typename = ""; this.type = null; this.sub = ""; this.resourceId = ""; this.scope = null; this.iat = null; this.exp = null; this.jti = ""; }
}
export class Mutation {
    __typename: t.String;
    resourceCreate: (args: {
        name: t.String;
    }) => Resource;
    userCreate: (args: {
        resourceId: t.String;
        values: ValuesInput;
        skipEmailVerification: t.Boolean;
    }) => UserCreate;
    userUpdate: (args: {
        id: t.String;
        values: ValuesInput_1;
    }) => User;
    userDelete: (args: {
        id: t.String;
    }) => t.NotSupportedYet;
    userTokenCreate: (args: {
        userId: t.String;
        name: t.String;
    }) => t.String;
    userTokenDelete: (args: {
        userId: t.String;
        tokenId: t.String;
    }) => t.Boolean;
    secretCreate: (args: {
        secret: SecretInput;
    }) => SecretObject;
    genericObjectCreate: (args: {
        genericObject: GenericObjectInput;
    }) => GenericObject;
    deployAuthentication: (args?: {
        resourceId?: t.String;
    }) => Deploy[];
    constructor() { this.__typename = ""; this.resourceCreate = fnProxy(Resource); this.userCreate = fnProxy(UserCreate); this.userUpdate = fnProxy(User); this.userDelete = () => null; this.userTokenCreate = () => ""; this.userTokenDelete = () => false; this.secretCreate = fnProxy(SecretObject); this.genericObjectCreate = fnProxy(GenericObject); this.deployAuthentication = fnArrayProxy(Deploy); }
}
export class UserCreate {
    __typename: t.String;
    user: User;
    accessToken: t.String;
    constructor() { this.__typename = ""; this.user = proxy(User); this.accessToken = ""; }
}
export class Deploy {
    __typename: t.String;
    login: t.String;
    resourceId: t.String;
    userId: t.String;
    constructor() { this.__typename = ""; this.login = ""; this.resourceId = ""; this.userId = ""; }
}

