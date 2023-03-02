
import { proxy, arrayProxy, fnProxy, fnArrayProxy, t } from "snek-query";



export class Query {
    __typename: t.String;
    me: (args?: {
        resourceId?: t.String;
    }) => Me[];
    version: t.String;
    constructor() { this.__typename = ""; this.me = fnArrayProxy(Me); this.version = ""; }
}
export class Me {
    __typename: t.String;
    user: User;
    issuedAt: t.Nullable<t.String>;
    expiresAt: t.Nullable<t.String>;
    constructor() { this.__typename = ""; this.user = proxy(User); this.issuedAt = null; this.expiresAt = null; }
}
export class User {
    __typename: t.String;
    id: t.String;
    username: t.String;
    primaryEmail: t.String;
    emails: t.String[];
    isAdmin: t.Boolean;
    resourceId: t.String;
    resource: Resource;
    constructor() { this.__typename = ""; this.id = ""; this.username = ""; this.primaryEmail = ""; this.emails = []; this.isAdmin = false; this.resourceId = ""; this.resource = proxy(Resource); }
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
export class Mutation {
    __typename: t.String;
    signIn: (args: {
        login: t.String;
        password: t.String;
        resourceId: t.String;
    }) => SignIn;
    signOut: (args?: {
        resourceId?: t.String;
    }) => t.Boolean;
    refresh: (args: {
        accessToken: t.String;
        refreshToken: t.String;
    }) => Refresh;
    resourceSignIn: (args: {
        id: t.String;
    }) => t.String;
    jaenPublish: (args: {
        resourceId: t.String;
        migrationURL: t.String;
    }) => t.String;
    constructor() { this.__typename = ""; this.signIn = fnProxy(SignIn); this.signOut = () => false; this.refresh = fnProxy(Refresh); this.resourceSignIn = () => ""; this.jaenPublish = () => ""; }
}
export class SignIn {
    __typename: t.String;
    tokenPair: TokenPair;
    user: User;
    me: Me[];
    constructor() { this.__typename = ""; this.tokenPair = proxy(TokenPair); this.user = proxy(User); this.me = arrayProxy(Me); }
}
export class TokenPair {
    __typename: t.String;
    accessToken: t.String;
    refreshToken: t.String;
    headers: t.NotSupportedYet;
    constructor() { this.__typename = ""; this.accessToken = ""; this.refreshToken = ""; this.headers = null; }
}
export class Refresh {
    __typename: t.String;
    tokenPair: TokenPair;
    me: Me[];
    constructor() { this.__typename = ""; this.tokenPair = proxy(TokenPair); this.me = arrayProxy(Me); }
}

