
import { proxy, arrayProxy, fnProxy, fnArrayProxy, t } from "snek-query";


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
    version: t.String;
    constructor() { this.__typename = ""; this.user = fnProxy(User); this.allUser = fnArrayProxy(User); this.resource = fnProxy(Resource); this.allResource = arrayProxy(Resource); this.version = ""; }
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
    constructor() { this.__typename = ""; this.isActive = false; this.id = ""; this.username = ""; this.resourceId = ""; this.accountId = ""; this.isAdmin = false; this.passwordHash = ""; this.primaryEmailAddressId = ""; this.primaryEmailAddress = proxy(EmailAddress); this.emails = arrayProxy(EmailAddress); this.account = proxy(Account); this.resource = proxy(Resource); }
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
export class Mutation {
    __typename: t.String;
    resourceCreate: (args: {
        name: t.String;
    }) => Resource;
    userCreate: (args: {
        resourceId: t.String;
        values: ValuesInput;
        skipEmailVerification: t.Boolean;
    }) => User;
    userUpdate: (args: {
        id: t.String;
        values: ValuesInput_1;
    }) => User;
    userDelete: (args: {
        id: t.String;
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
    constructor() { this.__typename = ""; this.resourceCreate = fnProxy(Resource); this.userCreate = fnProxy(User); this.userUpdate = fnProxy(User); this.userDelete = () => false; this.secretCreate = fnProxy(SecretObject); this.genericObjectCreate = fnProxy(GenericObject); this.deployAuthentication = fnArrayProxy(Deploy); }
}
export class Deploy {
    __typename: t.String;
    login: t.String;
    resourceId: t.String;
    userId: t.String;
    constructor() { this.__typename = ""; this.login = ""; this.resourceId = ""; this.userId = ""; }
}

