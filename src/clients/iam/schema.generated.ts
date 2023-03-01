import { proxy, arrayProxy, fnProxy, fnArrayProxy, t } from "snek-query";

type FilterInput = {
  ids?: t.String[];
  isActive?: t.Boolean;
  isAdmin?: t.Boolean;
};

export class Query {
  __typename: t.String;
  user: (args: { id: t.String }) => User;
  users: (args?: { filter?: FilterInput }) => User[];
  username: (args: { id: t.String }) => Username;
  usernames: Username[];
  account: (args: { id: t.String }) => t.Nullable<Account>;
  accounts: Account[];
  resource: (args: { id: t.String }) => Resource;
  resources: Resource[];
  email: (args: { id: t.String }) => t.Nullable<Email>;
  emails: Email[];
  login: (args: { login: t.String }) => t.Nullable<Login>;
  logins: (args: { resourceId: t.String }) => Login[];
  snekId: (args: { id: t.String }) => t.Nullable<SnekId>;
  snekIds: SnekId[];
  genericObject: (args: { id: t.String }) => GenericObject;
  genericObjects: GenericObject[];
  aliasCheckAvailability: (args: {
    login: t.String;
    resourceId: t.String;
  }) => t.Boolean;
  constructor() {
    this.__typename = "";
    this.user = fnProxy(User);
    this.users = fnArrayProxy(User);
    this.username = fnProxy(Username);
    this.usernames = arrayProxy(Username);
    this.account = fnProxy(Account);
    this.accounts = arrayProxy(Account);
    this.resource = fnProxy(Resource);
    this.resources = arrayProxy(Resource);
    this.email = fnProxy(Email);
    this.emails = arrayProxy(Email);
    this.login = fnProxy(Login);
    this.logins = fnArrayProxy(Login);
    this.snekId = fnProxy(SnekId);
    this.snekIds = arrayProxy(SnekId);
    this.genericObject = fnProxy(GenericObject);
    this.genericObjects = arrayProxy(GenericObject);
    this.aliasCheckAvailability = () => false;
  }
}
export class User {
  __typename: t.String;
  isActive: t.Boolean;
  id: t.String;
  resourceId: t.String;
  accountId: t.String;
  emails: Email[];
  username: t.Nullable<Username>;
  account: t.Nullable<Account>;
  resource: t.Nullable<Resource>;
  snekId: t.Nullable<SnekId>;
  constructor() {
    this.__typename = "";
    this.isActive = false;
    this.id = "";
    this.resourceId = "";
    this.accountId = "";
    this.emails = arrayProxy(Email);
    this.username = proxy(Username);
    this.account = proxy(Account);
    this.resource = proxy(Resource);
    this.snekId = proxy(SnekId);
  }
}
export class Email {
  __typename: t.String;
  id: t.String;
  email: t.String;
  userId: t.Nullable<t.String>;
  snekId: t.Nullable<SnekId>;
  account: t.Nullable<Account>;
  user: t.Nullable<User>;
  constructor() {
    this.__typename = "";
    this.id = "";
    this.email = "";
    this.userId = null;
    this.snekId = proxy(SnekId);
    this.account = proxy(Account);
    this.user = proxy(User);
  }
}
export class SnekId {
  __typename: t.String;
  id: t.String;
  sid: t.String;
  snekObject: t.Nullable<SnekObject>;
  constructor() {
    this.__typename = "";
    this.id = "";
    this.sid = "";
    this.snekObject = proxy(SnekObject);
  }
}
export class SnekObject {
  __typename: t.String;
  id: t.String;
  user: t.Nullable<User>;
  resource: t.Nullable<Resource>;
  account: t.Nullable<Account>;
  username: t.Nullable<Username>;
  email: t.Nullable<Email>;
  genericObject: t.Nullable<GenericObject>;
  constructor() {
    this.__typename = "";
    this.id = "";
    this.user = proxy(User);
    this.resource = proxy(Resource);
    this.account = proxy(Account);
    this.username = proxy(Username);
    this.email = proxy(Email);
    this.genericObject = proxy(GenericObject);
  }
}
export class Resource {
  __typename: t.String;
  id: t.String;
  name: t.String;
  accountId: t.String;
  users: User[];
  account: t.Nullable<Account>;
  snekId: t.Nullable<SnekId>;
  constructor() {
    this.__typename = "";
    this.id = "";
    this.name = "";
    this.accountId = "";
    this.users = arrayProxy(User);
    this.account = proxy(Account);
    this.snekId = proxy(SnekId);
  }
}
export class Account {
  __typename: t.String;
  id: t.String;
  emailId: t.String;
  users: User[];
  email: t.Nullable<Email>;
  resources: Resource[];
  snekId: t.Nullable<SnekId>;
  constructor() {
    this.__typename = "";
    this.id = "";
    this.emailId = "";
    this.users = arrayProxy(User);
    this.email = proxy(Email);
    this.resources = arrayProxy(Resource);
    this.snekId = proxy(SnekId);
  }
}
export class Username {
  __typename: t.String;
  id: t.String;
  username: t.String;
  userId: t.Nullable<t.String>;
  snekId: t.Nullable<SnekId>;
  user: t.Nullable<User>;
  constructor() {
    this.__typename = "";
    this.id = "";
    this.username = "";
    this.userId = null;
    this.snekId = proxy(SnekId);
    this.user = proxy(User);
  }
}
export class GenericObject {
  __typename: t.String;
  id: t.String;
  value: t.NotSupportedYet;
  snekId: t.Nullable<SnekId>;
  constructor() {
    this.__typename = "";
    this.id = "";
    this.value = null;
    this.snekId = proxy(SnekId);
  }
}
export class Login {
  __typename: t.String;
  type: t.String;
  login: t.String;
  user: t.Nullable<User>;
  constructor() {
    this.__typename = "";
    this.type = "";
    this.login = "";
    this.user = proxy(User);
  }
}
export class Mutation {
  __typename: t.String;
  inputArray: (args: { input: t.String[] }) => t.String;
  userCreate: (args: {
    resourceId: t.String;
    email: t.String;
    username: t.String;
    accountId?: t.String;
    isActive: t.Boolean;
  }) => User;
  constructor() {
    this.__typename = "";
    this.inputArray = () => "";
    this.userCreate = fnProxy(User);
  }
}
