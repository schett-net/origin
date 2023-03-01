import { proxy, arrayProxy, fnProxy, fnArrayProxy, t } from "snek-query";

type PublishConfigInput = {
  jaenGitHubRemote: t.String;
  jaenGitHubCwd?: t.String;
  jaenGitHubAccessToken: t.String;
};

export class Query {
  __typename: t.String;
  version: t.String;
  constructor() {
    this.__typename = "";
    this.version = "";
  }
}
export class Mutation {
  __typename: t.String;
  publish: (args: {
    migrationURL: t.String;
    config: PublishConfigInput;
  }) => PublishEvent;
  constructor() {
    this.__typename = "";
    this.publish = fnProxy(PublishEvent);
  }
}
export class PublishEvent {
  __typename: t.String;
  publishedDate: Date;
  repositoryPath: t.String;
  constructor() {
    this.__typename = "";
    this.publishedDate = proxy(Date);
    this.repositoryPath = "";
  }
}
export class Date {
  __typename: t.String;
  toDateString: t.String;
  toTimeString: t.String;
  toLocaleDateString: t.String;
  toLocaleTimeString: t.String;
  getTime: t.NotSupportedYet;
  getFullYear: t.NotSupportedYet;
  getUTCFullYear: t.NotSupportedYet;
  getMonth: t.NotSupportedYet;
  getUTCMonth: t.NotSupportedYet;
  getDate: t.NotSupportedYet;
  getUTCDate: t.NotSupportedYet;
  getDay: t.NotSupportedYet;
  getUTCDay: t.NotSupportedYet;
  getHours: t.NotSupportedYet;
  getUTCHours: t.NotSupportedYet;
  getMinutes: t.NotSupportedYet;
  getUTCMinutes: t.NotSupportedYet;
  getSeconds: t.NotSupportedYet;
  getUTCSeconds: t.NotSupportedYet;
  getMilliseconds: t.NotSupportedYet;
  getUTCMilliseconds: t.NotSupportedYet;
  getTimezoneOffset: t.NotSupportedYet;
  setTime: (args: { time: t.NotSupportedYet }) => t.NotSupportedYet;
  setMilliseconds: (args: { ms: t.NotSupportedYet }) => t.NotSupportedYet;
  setUTCMilliseconds: (args: { ms: t.NotSupportedYet }) => t.NotSupportedYet;
  setSeconds: (args: {
    sec: t.NotSupportedYet;
    ms?: t.NotSupportedYet;
  }) => t.NotSupportedYet;
  setUTCSeconds: (args: {
    sec: t.NotSupportedYet;
    ms?: t.NotSupportedYet;
  }) => t.NotSupportedYet;
  setMinutes: (args: {
    min: t.NotSupportedYet;
    sec?: t.NotSupportedYet;
    ms?: t.NotSupportedYet;
  }) => t.NotSupportedYet;
  setUTCMinutes: (args: {
    min: t.NotSupportedYet;
    sec?: t.NotSupportedYet;
    ms?: t.NotSupportedYet;
  }) => t.NotSupportedYet;
  setHours: (args: {
    hours: t.NotSupportedYet;
    min?: t.NotSupportedYet;
    sec?: t.NotSupportedYet;
    ms?: t.NotSupportedYet;
  }) => t.NotSupportedYet;
  setUTCHours: (args: {
    hours: t.NotSupportedYet;
    min?: t.NotSupportedYet;
    sec?: t.NotSupportedYet;
    ms?: t.NotSupportedYet;
  }) => t.NotSupportedYet;
  setDate: (args: { date: t.NotSupportedYet }) => t.NotSupportedYet;
  setUTCDate: (args: { date: t.NotSupportedYet }) => t.NotSupportedYet;
  setMonth: (args: {
    month: t.NotSupportedYet;
    date?: t.NotSupportedYet;
  }) => t.NotSupportedYet;
  setUTCMonth: (args: {
    month: t.NotSupportedYet;
    date?: t.NotSupportedYet;
  }) => t.NotSupportedYet;
  setFullYear: (args: {
    year: t.NotSupportedYet;
    month?: t.NotSupportedYet;
    date?: t.NotSupportedYet;
  }) => t.NotSupportedYet;
  setUTCFullYear: (args: {
    year: t.NotSupportedYet;
    month?: t.NotSupportedYet;
    date?: t.NotSupportedYet;
  }) => t.NotSupportedYet;
  toUTCString: t.String;
  toISOString: t.String;
  toJSON: (args: { key: t.NotSupportedYet }) => t.String;
  getVarDate: VarDate;
  constructor() {
    this.__typename = "";
    this.toDateString = "";
    this.toTimeString = "";
    this.toLocaleDateString = "";
    this.toLocaleTimeString = "";
    this.getTime = null;
    this.getFullYear = null;
    this.getUTCFullYear = null;
    this.getMonth = null;
    this.getUTCMonth = null;
    this.getDate = null;
    this.getUTCDate = null;
    this.getDay = null;
    this.getUTCDay = null;
    this.getHours = null;
    this.getUTCHours = null;
    this.getMinutes = null;
    this.getUTCMinutes = null;
    this.getSeconds = null;
    this.getUTCSeconds = null;
    this.getMilliseconds = null;
    this.getUTCMilliseconds = null;
    this.getTimezoneOffset = null;
    this.setTime = () => null;
    this.setMilliseconds = () => null;
    this.setUTCMilliseconds = () => null;
    this.setSeconds = () => null;
    this.setUTCSeconds = () => null;
    this.setMinutes = () => null;
    this.setUTCMinutes = () => null;
    this.setHours = () => null;
    this.setUTCHours = () => null;
    this.setDate = () => null;
    this.setUTCDate = () => null;
    this.setMonth = () => null;
    this.setUTCMonth = () => null;
    this.setFullYear = () => null;
    this.setUTCFullYear = () => null;
    this.toUTCString = "";
    this.toISOString = "";
    this.toJSON = () => "";
    this.getVarDate = proxy(VarDate);
  }
}
export class VarDate {
  __typename: t.String;
  VarDate_typekey: VarDate;
  constructor() {
    this.__typename = "";
    this.VarDate_typekey = proxy(VarDate);
  }
}
