
import { proxy, arrayProxy, fnProxy, fnArrayProxy, t } from "snek-query";


type ValuesInputInput = {
    emailAddress: t.String;
    username: t.String;
    password: t.String;
    accountId?: t.String;
    isActive?: t.Boolean;
};

export class Query {
    __typename: t.String;
    userMe: (args?: {
        resourceId?: t.String;
    }) => User[];
    resource: (args: {
        id: t.String;
    }) => Resource;
    version: t.String;
    constructor() { this.__typename = ""; this.userMe = fnArrayProxy(User); this.resource = fnProxy(Resource); this.version = ""; }
}
export class User {
    __typename: t.String;
    id: t.String;
    username: t.String;
    primaryEmailAddress: t.String;
    emailAddresses: t.String[];
    isAdmin: t.Boolean;
    resource: Resource;
    constructor() { this.__typename = ""; this.id = ""; this.username = ""; this.primaryEmailAddress = ""; this.emailAddresses = []; this.isAdmin = false; this.resource = proxy(Resource); }
}
export class Resource {
    __typename: t.String;
    id: t.String;
    name: t.String;
    config: Config;
    secret: (args: {
        name: t.String;
    }) => Secret;
    constructor() { this.__typename = ""; this.id = ""; this.name = ""; this.config = proxy(Config); this.secret = fnProxy(Secret); }
}
export class Config {
    __typename: t.String;
    jaen: t.Nullable<Jaen>;
    access: t.Nullable<Access>;
    constructor() { this.__typename = ""; this.jaen = proxy(Jaen); this.access = proxy(Access); }
}
export class Jaen {
    __typename: t.String;
    repository: t.String;
    repositoryCwd: t.Nullable<t.String>;
    constructor() { this.__typename = ""; this.repository = ""; this.repositoryCwd = null; }
}
export class Access {
    __typename: t.String;
    baseURL: t.String;
    signInURL: t.Nullable<t.String>;
    signOutURL: t.Nullable<t.String>;
    constructor() { this.__typename = ""; this.baseURL = ""; this.signInURL = null; this.signOutURL = null; }
}
export class Secret {
    __typename: t.String;
    name: t.String;
    value: t.NotSupportedYet;
    constructor() { this.__typename = ""; this.name = ""; this.value = null; }
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
    resourceJaenPublish: (args: {
        resourceId: t.String;
        migrationURL: t.String;
    }) => t.String;
    userRegister: (args: {
        resourceId: t.String;
        values: ValuesInputInput;
        skipEmailVerification?: t.Boolean;
    }) => UserRegister;
    constructor() { this.__typename = ""; this.userSignIn = fnProxy(UserSignIn); this.userSignOut = () => null; this.userRefresh = fnProxy(UserRefresh); this.userSSO = fnProxy(UserSSO); this.resourceJaenPublish = () => ""; this.userRegister = fnProxy(UserRegister); }
}
export class UserSignIn {
    __typename: t.String;
    tokenPair: TokenPair;
    user: User;
    me: (args?: {
        resourceId?: t.String;
    }) => User[];
    constructor() { this.__typename = ""; this.tokenPair = proxy(TokenPair); this.user = proxy(User); this.me = fnArrayProxy(User); }
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
    me: User[];
    constructor() { this.__typename = ""; this.tokenPair = proxy(TokenPair); this.me = arrayProxy(User); }
}
export class UserSSO {
    __typename: t.String;
    tokenPair: TokenPair;
    user: User;
    me: User[];
    constructor() { this.__typename = ""; this.tokenPair = proxy(TokenPair); this.user = proxy(User); this.me = arrayProxy(User); }
}
export class UserRegister {
    __typename: t.String;
    user: User;
    constructor() { this.__typename = ""; this.user = proxy(User); }
}

