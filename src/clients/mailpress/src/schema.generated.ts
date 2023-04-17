
import { proxy, arrayProxy, fnProxy, fnArrayProxy, t } from "snek-query";

enum EmailAddressType {
    EMAIL_ADDRESS = "EMAIL_ADDRESS",
    EMAIL_ID = "EMAIL_ID",
    USER_ID = "USER_ID"
}
enum EmailAddressTypeInput {
    EMAIL_ADDRESS = "EMAIL_ADDRESS",
    EMAIL_ID = "EMAIL_ID",
    USER_ID = "USER_ID"
}

type EmailEnvelopeInput = {
    from?: EmailAddressInput;
    to?: EmailAddressInput[];
    subject?: t.String;
    replyTo?: EmailAddressInput;
};
type EmailAddressInput = {
    value: t.String;
    type: EmailAddressTypeInput;
};
type TemplateInput = {
    id: t.String;
    values?: t.NotSupportedYet;
};
type EmailTemplateInput = {
    content: t.String;
    variables?: t.NotSupportedYet;
    envelope?: EmailEnvelopeInput;
    authorizationUser?: AuthorizationUserInput;
    confirmationTemplateId?: t.String;
};
type AuthorizationUserInput = {
    id: t.String;
    authorization: t.String;
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
    content: t.String;
    variables: t.Nullable<t.NotSupportedYet>;
    envelope: t.Nullable<EmailEnvelope>;
    authorizationUser: t.Nullable<AuthorizationUser>;
    confirmationTemplateId: t.Nullable<t.String>;
    constructor() { this.__typename = ""; this.content = ""; this.variables = null; this.envelope = proxy(EmailEnvelope); this.authorizationUser = proxy(AuthorizationUser); this.confirmationTemplateId = null; }
}
export class EmailEnvelope {
    __typename: t.String;
    from: t.Nullable<EmailAddress>;
    to: t.Nullable<EmailAddress>[];
    subject: t.Nullable<t.String>;
    replyTo: t.Nullable<EmailAddress>;
    constructor() { this.__typename = ""; this.from = proxy(EmailAddress); this.to = arrayProxy(EmailAddress); this.subject = null; this.replyTo = proxy(EmailAddress); }
}
export class EmailAddress {
    __typename: t.String;
    value: t.String;
    type: t.Nullable<EmailAddressType>;
    constructor() { this.__typename = ""; this.value = ""; this.type = null; }
}
export class AuthorizationUser {
    __typename: t.String;
    id: t.String;
    authorization: t.String;
    constructor() { this.__typename = ""; this.id = ""; this.authorization = ""; }
}
export class Mutation {
    __typename: t.String;
    mailSchedule: (args: {
        envelope: EmailEnvelopeInput;
        body?: t.String;
        template?: TemplateInput;
    }) => t.String;
    createTemplate: (args: {
        id: t.String;
        template: EmailTemplateInput;
    }) => EmailTemplate;
    constructor() { this.__typename = ""; this.mailSchedule = () => ""; this.createTemplate = fnProxy(EmailTemplate); }
}

