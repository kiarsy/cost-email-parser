import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser'
import { EventType, PublishedEventType } from './EventType';
import { StatementParser } from './statementParser'
import { FileParser } from './FileParser'
import { StorageControl } from './StorageControl'
import { XlsxHelper } from './XlsxHelper'
import { PrismaHelper } from './PrismaHelper';

let PROJECT_ID = process.env["PROJECT_ID"] ?? '';
let BUCKET_EMAIL_ATTACHMENT = process.env["BUCKET_EMAIL_ATTACHMENT"] ?? '';
// let TOPIC_COST_STORE = process.env["TOPIC_COST_STORE"] ?? '';

const port = 3000;
const statementParser = new StatementParser();
const fileParser = new FileParser();
const xlsxHelper = new XlsxHelper();

const storageControl = new StorageControl(PROJECT_ID, BUCKET_EMAIL_ATTACHMENT);
const prismaHandle = new PrismaHelper();

const app: Express = express();
app.use(bodyParser.json())

app.post('/parse', async (req: Request, res: Response) => {
    // parse body
    if (!req.body) {
        const msg = "no Pub/Sub message received";
        console.error(`error: ${msg}`);
        res.status(400).send(`Bad Request: ${msg}`);
        return
    }
    if (!req.body.message) {
        const msg = "invalid Pub/Sub message format";
        console.error(`error: ${msg}`);
        res.status(400).send(`Bad Request: ${msg}`);
        return
    }
    // parse message
    const pubSubMessage = req.body.message;
    const originatorMessage = Buffer.from(pubSubMessage.data, "base64").toString().trim();
    const event: PublishedEventType = JSON.parse(originatorMessage);

    await Promise.all(event.files.map(async (it) => {
        if (fileParser.isXlsx(it)) {
            const buffer = await storageControl.downloadToBuffer(it.name);
            await handleAttachment(buffer, event);
        }
    }));

    res.status(204).send()
});

app.get('/', async (req: Request, res: Response) => {
    const x = await prismaHandle.prisma.user.count();
    let user = await prismaHandle.prisma.userEmails.findFirst({ where: { email: "hossein.kiarsy@gmail.com" } });

    res.send('EMAIL PARSER Server:' + x + " " + user?.email);
});
// a08e8e81-6aa7-4327-8ceb-053f479e9ae3.2@dev.hoory-mail.com
async function handleAttachment(file: Buffer, event: PublishedEventType) {
    const sheet = xlsxHelper.read(file.buffer);

    const meta = statementParser.readMeta(sheet);
    console.log("meta:", meta)
    await Promise.all(statementParser.readAll(sheet).map(async it => {
        const recordEvent: EventType = {
            mail: {
                from: event.fields.from,
                to: event.fields.to,
                id: event.fields.email_id
            },
            meta: meta,
            record: {
                ...it,
                credit: Number(it.credit),
                debit: Number(it.debit),
            }
        };
        prismaHandle.handle(recordEvent);
    }));
}

// import fs from 'fs'
// const file = fs.readFileSync('/Users/kiarsy/Downloads/STATEMENT\ 04.01.2023-01.02.2023\ CARD\ MC\ 3943\ AMD\ \(1\).xlsx')
// const file = fs.readFileSync('/Users/kiarsy/Downloads/STATEMENT 01.11.2022-30.11.2022 CARD ARCA AMD xxxxxxxxxxxx1519.xlsx')
// const file = fs.readFileSync('/Users/kiarsy/Downloads/STATEMENT 18.11.2022-18.12.2022 DD 001 AMD.xlsx')
// handleAttachment(file, {} as any);

app.listen(port, () => {
    console.log(`[server]: Server new is running at http://localhost:${port}`);
});

