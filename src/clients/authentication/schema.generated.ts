
import { proxy, arrayProxy, fnProxy, fnArrayProxy, t } from "snek-query";



export class Query {
    __typename: t.String;
    userAuthenticate: (args: {
        login: t.String;
        resourceId: t.String;
        password: t.String;
    }) => t.Nullable<UserAuthenticate>;
    constructor() { this.__typename = ""; this.userAuthenticate = fnProxy(UserAuthenticate); }
}
export class UserAuthenticate {
    __typename: t.String;
    userId: t.NotSupportedYet;
    constructor() { this.__typename = ""; this.userId = null; }
}
export class Mutation {
    __typename: t.String;
    userAuthenticate: (args: {
        login: t.String;
        resourceId: t.String;
        password: t.String;
    }) => t.Nullable<UserAuthenticate>;
    constructor() { this.__typename = ""; this.userAuthenticate = fnProxy(UserAuthenticate); }
}

