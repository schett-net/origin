
import { proxy, arrayProxy, fnProxy, fnArrayProxy, t } from "snek-query";

export enum EmailAddressType {
    EMAIL_ADDRESS = "EMAIL_ADDRESS",
    EMAIL_ID = "EMAIL_ID",
    USER_ID = "USER_ID"
}
export enum EmailAddressTypeInput {
    EMAIL_ADDRESS = "EMAIL_ADDRESS",
    EMAIL_ID = "EMAIL_ID",
    USER_ID = "USER_ID"
}

export type undefined = {
    _?: t.String;
};
export type DataInput = {
    content: t.String;
    description: t.String;
    authorizationUser?: AuthorizationUserInput;
    variables?: VariablesInput[];
    envelope?: EnvelopeInput_1;
};
export type AuthorizationUserInput = {
    userId: t.String;
    authorization: t.String;
};
export type VariablesInput = {
    name: t.String;
    isRequired?: t.Boolean;
    isConstant?: t.Boolean;
    description?: t.String;
    defaultValue?: t.String;
};
export type EnvelopeInput_1 = {
    subject?: t.String;
    to?: ToInput[];
    from?: FromInput;
    replyTo?: ReplyToInput;
};
export type ToInput = {
    value: t.String;
    type: EmailAddressTypeInput;
};
export type FromInput = {
    value: t.String;
    type: EmailAddressTypeInput;
};
export type ReplyToInput = {
    value: t.String;
    type: EmailAddressTypeInput;
};
export type DataInput_1 = {
    content?: t.String;
    description?: t.String;
    transformer?: t.String;
    authorizationUser?: AuthorizationUserInput_1;
    envelope?: EnvelopeInput_1_2;
    parentId?: t.String;
    linkedIds?: t.String[];
    variables?: VariablesInput_1[];
};
export type AuthorizationUserInput_1 = {
    userId: t.String;
    authorization: t.String;
};
export type EnvelopeInput_1_2 = {
    subject?: t.String;
    to?: ToInput_1[];
    from?: FromInput_1;
    replyTo?: ReplyToInput_1;
};
export type ToInput_1 = {
    value: t.String;
    type: EmailAddressTypeInput;
};
export type FromInput_1 = {
    value: t.String;
    type: EmailAddressTypeInput;
};
export type ReplyToInput_1 = {
    value: t.String;
    type: EmailAddressTypeInput;
};
export type VariablesInput_1 = {
    id?: t.String;
    name: t.String;
    isRequired?: t.Boolean;
    isConstant?: t.Boolean;
    description?: t.String;
    defaultValue?: t.String;
};
export type EnvelopeInput = {
    subject?: t.String;
    to?: ToInput_1_2[];
    from?: FromInput_1_2;
    replyTo?: ReplyToInput_1_2;
};
export type ToInput_1_2 = {
    value: t.String;
    type: EmailAddressTypeInput;
};
export type FromInput_1_2 = {
    value: t.String;
    type: EmailAddressTypeInput;
};
export type ReplyToInput_1_2 = {
    value: t.String;
    type: EmailAddressTypeInput;
};
export type TemplateInput = {
    id: t.String;
    values?: t.NotSupportedYet;
};

export class Query {
    __typename: t.String;
    template: (args: {
        id: t.String;
    }) => EmailTemplate;
    allTemplate: EmailTemplate[];
    version: t.String;
    constructor() { this.__typename = ""; this.template = fnProxy(EmailTemplate); this.allTemplate = arrayProxy(EmailTemplate); this.version = ""; }
}
export class EmailTemplate {
    __typename: t.String;
    id: t.String;
    description: t.String;
    content: t.String;
    verifyReplyTo: t.Nullable<t.Boolean>;
    transformer: t.Nullable<t.String>;
    authorizationUser: t.Nullable<AuthorizationUser>;
    envelope: t.Nullable<EmailEnvelope>;
    parent: t.Nullable<EmailTemplate>;
    linked: EmailTemplate[];
    variables: VariableDefinition[];
    createdBy: t.String;
    resourceId: t.String;
    createdAt: t.Date;
    updatedAt: t.Date;
    constructor() { this.__typename = ""; this.id = ""; this.description = ""; this.content = ""; this.verifyReplyTo = null; this.transformer = null; this.authorizationUser = proxy(AuthorizationUser); this.envelope = proxy(EmailEnvelope); this.parent = proxy(EmailTemplate); this.linked = arrayProxy(EmailTemplate); this.variables = arrayProxy(VariableDefinition); this.createdBy = ""; this.resourceId = ""; this.createdAt = ""; this.updatedAt = ""; }
}
export class AuthorizationUser {
    __typename: t.String;
    id: t.String;
    userId: t.String;
    authorization: t.String;
    EmailTemplate: EmailTemplate[];
    constructor() { this.__typename = ""; this.id = ""; this.userId = ""; this.authorization = ""; this.EmailTemplate = arrayProxy(EmailTemplate); }
}
export class EmailEnvelope {
    __typename: t.String;
    id: t.String;
    subject: t.Nullable<t.String>;
    EmailTemplate: EmailTemplate[];
    from: t.Nullable<EmailAddress>;
    replyTo: t.Nullable<EmailAddress>;
    to: EmailAddress[];
    constructor() { this.__typename = ""; this.id = ""; this.subject = null; this.EmailTemplate = arrayProxy(EmailTemplate); this.from = proxy(EmailAddress); this.replyTo = proxy(EmailAddress); this.to = arrayProxy(EmailAddress); }
}
export class EmailAddress {
    __typename: t.String;
    id: t.String;
    value: t.String;
    type: t.Nullable<EmailAddressType>;
    ToEnvelopes: EmailEnvelope[];
    FromEnvelopes: EmailEnvelope[];
    ReplyToEnvelopes: EmailEnvelope[];
    constructor() { this.__typename = ""; this.id = ""; this.value = ""; this.type = null; this.ToEnvelopes = arrayProxy(EmailEnvelope); this.FromEnvelopes = arrayProxy(EmailEnvelope); this.ReplyToEnvelopes = arrayProxy(EmailEnvelope); }
}
export class VariableDefinition {
    __typename: t.String;
    id: t.String;
    name: t.String;
    description: t.Nullable<t.String>;
    defaultValue: t.Nullable<t.String>;
    isRequired: t.Nullable<t.Boolean>;
    isConstant: t.Nullable<t.Boolean>;
    EmailTemplate: t.Nullable<EmailTemplate>;
    constructor() { this.__typename = ""; this.id = ""; this.name = ""; this.description = null; this.defaultValue = null; this.isRequired = null; this.isConstant = null; this.EmailTemplate = proxy(EmailTemplate); }
}
export class Mutation {
    __typename: t.String;
    templateCreate: (args: {
        data: DataInput;
    }) => EmailTemplate;
    templateUpdate: (args: {
        id: t.String;
        data: DataInput_1;
    }) => EmailTemplate;
    templateDelete: (args: {
        id: t.String;
    }) => EmailTemplate;
    mailSchedule: (args: {
        envelope: EnvelopeInput;
        body?: t.String;
        bodyHTML?: t.String;
        template?: TemplateInput;
    }) => t.String;
    constructor() { this.__typename = ""; this.templateCreate = fnProxy(EmailTemplate); this.templateUpdate = fnProxy(EmailTemplate); this.templateDelete = fnProxy(EmailTemplate); this.mailSchedule = () => ""; }
}

