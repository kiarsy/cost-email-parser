import { StatementFile } from "./FileParser";
import { AccountMeta } from "./statementParser";

export type PublishedEventType = {
    fields: {
        headers: string,
        dkim: string,
        'content-ids': string,
        to: string,
        html: string,
        from: string,
        text: string,
        sender_ip: string,
        envelope: string,
        attachments: string,
        subject: string,
        'attachment-info': string,
        charsets: string,
        SPF: string,
        email_id: string
    },
    files: StatementFile[]
};

export type EventType = {
    mail: {
        from: string,
        to: string,
        id: string
    },
    meta: AccountMeta,
    record: {
        credit: number,
        debit: number,
        currency: string,
        date: string,
        description: string
    }
}

export function getEmail(email: string) {
    const r = /([\w\.]+@([\w-]+\.)+[\w-]{2,4})/g.exec(email);
    if (r && r?.length > 0)
        return r[0];
    return undefined;
}