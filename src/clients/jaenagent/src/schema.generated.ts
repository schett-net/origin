
import { proxy, arrayProxy, fnProxy, fnArrayProxy, t } from "snek-query";


export type PublishConfigInput = {
    repository: t.String;
    repositoryCwd?: t.String;
    githubAccessToken: t.String;
};

export class Query {
    __typename: t.String;
    version: t.String;
    constructor() { this.__typename = ""; this.version = ""; }
}
export class Mutation {
    __typename: t.String;
    publish: (args: {
        migrationURL: t.String;
        config: PublishConfigInput;
    }) => PublishEvent;
    constructor() { this.__typename = ""; this.publish = fnProxy(PublishEvent); }
}
export class PublishEvent {
    __typename: t.String;
    publishedDate: Date;
    repositoryPath: t.String;
    constructor() { this.__typename = ""; this.publishedDate = proxy(Date); this.repositoryPath = ""; }
}
export class Date {
    __typename: t.String;
    toDateString: t.String;
    toTimeString: t.String;
    toLocaleDateString: t.String;
    toLocaleTimeString: t.String;
    getTime: t.Number;
    getFullYear: t.Number;
    getUTCFullYear: t.Number;
    getMonth: t.Number;
    getUTCMonth: t.Number;
    getDate: t.Number;
    getUTCDate: t.Number;
    getDay: t.Number;
    getUTCDay: t.Number;
    getHours: t.Number;
    getUTCHours: t.Number;
    getMinutes: t.Number;
    getUTCMinutes: t.Number;
    getSeconds: t.Number;
    getUTCSeconds: t.Number;
    getMilliseconds: t.Number;
    getUTCMilliseconds: t.Number;
    getTimezoneOffset: t.Number;
    setTime: (args: {
        time: t.Number;
    }) => t.Number;
    setMilliseconds: (args: {
        ms: t.Number;
    }) => t.Number;
    setUTCMilliseconds: (args: {
        ms: t.Number;
    }) => t.Number;
    setSeconds: (args: {
        sec: t.Number;
        ms?: t.Number;
    }) => t.Number;
    setUTCSeconds: (args: {
        sec: t.Number;
        ms?: t.Number;
    }) => t.Number;
    setMinutes: (args: {
        min: t.Number;
        sec?: t.Number;
        ms?: t.Number;
    }) => t.Number;
    setUTCMinutes: (args: {
        min: t.Number;
        sec?: t.Number;
        ms?: t.Number;
    }) => t.Number;
    setHours: (args: {
        hours: t.Number;
        min?: t.Number;
        sec?: t.Number;
        ms?: t.Number;
    }) => t.Number;
    setUTCHours: (args: {
        hours: t.Number;
        min?: t.Number;
        sec?: t.Number;
        ms?: t.Number;
    }) => t.Number;
    setDate: (args: {
        date: t.Number;
    }) => t.Number;
    setUTCDate: (args: {
        date: t.Number;
    }) => t.Number;
    setMonth: (args: {
        month: t.Number;
        date?: t.Number;
    }) => t.Number;
    setUTCMonth: (args: {
        month: t.Number;
        date?: t.Number;
    }) => t.Number;
    setFullYear: (args: {
        year: t.Number;
        month?: t.Number;
        date?: t.Number;
    }) => t.Number;
    setUTCFullYear: (args: {
        year: t.Number;
        month?: t.Number;
        date?: t.Number;
    }) => t.Number;
    toUTCString: t.String;
    toISOString: t.String;
    toJSON: (args: {
        key: t.NotSupportedYet;
    }) => t.String;
    getVarDate: VarDate;
    constructor() { this.__typename = ""; this.toDateString = ""; this.toTimeString = ""; this.toLocaleDateString = ""; this.toLocaleTimeString = ""; this.getTime = null; this.getFullYear = null; this.getUTCFullYear = null; this.getMonth = null; this.getUTCMonth = null; this.getDate = null; this.getUTCDate = null; this.getDay = null; this.getUTCDay = null; this.getHours = null; this.getUTCHours = null; this.getMinutes = null; this.getUTCMinutes = null; this.getSeconds = null; this.getUTCSeconds = null; this.getMilliseconds = null; this.getUTCMilliseconds = null; this.getTimezoneOffset = null; this.setTime = () => null; this.setMilliseconds = () => null; this.setUTCMilliseconds = () => null; this.setSeconds = () => null; this.setUTCSeconds = () => null; this.setMinutes = () => null; this.setUTCMinutes = () => null; this.setHours = () => null; this.setUTCHours = () => null; this.setDate = () => null; this.setUTCDate = () => null; this.setMonth = () => null; this.setUTCMonth = () => null; this.setFullYear = () => null; this.setUTCFullYear = () => null; this.toUTCString = ""; this.toISOString = ""; this.toJSON = () => ""; this.getVarDate = proxy(VarDate); }
}
export class VarDate {
    __typename: t.String;
    VarDate_typekey: VarDate;
    constructor() { this.__typename = ""; this.VarDate_typekey = proxy(VarDate); }
}

