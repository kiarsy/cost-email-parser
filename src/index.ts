import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser'
import { EventType } from './EventType';
import { StatementParser } from './statementParser'
import { FileParser } from './FileParser'
import { StorageControl } from './StorageControl'
import { EventBus } from './EventBus'
import { XlsxHelper } from './XlsxHelper'

let PROJECT_ID = process.env["PROJECT_ID"] ?? '';
let BUCKET_EMAIL_ATTACHMENT = process.env["BUCKET_EMAIL_ATTACHMENT"] ?? '';
let TOPIC_COST_STORE = process.env["TOPIC_COST_STORE"] ?? '';

const port = 3000;
const statementParser = new StatementParser();
const fileParser = new FileParser();
const xlsxHelper = new XlsxHelper();
const eventBus = new EventBus(PROJECT_ID);
const storageControl = new StorageControl(PROJECT_ID, BUCKET_EMAIL_ATTACHMENT);

const app: Express = express();
app.use(bodyParser.json())

app.post('/parse', (req: Request, res: Response) => {
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
    const event: EventType = JSON.parse(originatorMessage);

    event.files.forEach(async it => {
        if (fileParser.isXlsx(it)) {
            const buffer = await storageControl.downloadToBuffer(it.name);
            handleAttachment(buffer, event);
        }
    });
    res.status(204).send()
});

app.get('/', (req: Request, res: Response) => {
    res.send('EMAIL PARSER Server');
});

function handleAttachment(file: Buffer, event: EventType) {
    const [meta, sheet] = xlsxHelper.read(file.buffer);

    statementParser.readAll(sheet).forEach(it => {
        eventBus.publish(TOPIC_COST_STORE, {
            mail: {
                from: event.fields.from,
                to: event.fields.to,
                id: event.fields.email_id
            },
            meta: meta,
            record: it
        }, {});
    })
}

app.listen(port, () => {
    console.log(`[server]: Server new is running at http://localhost:${port}`);
});

