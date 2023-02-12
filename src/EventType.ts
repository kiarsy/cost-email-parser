import { StatementFile } from "./FileParser";

export type EventType = {
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