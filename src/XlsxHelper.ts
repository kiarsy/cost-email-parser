import XLSX from 'xlsx'
import { AccountMeta, StatementParser } from './statementParser';

export class XlsxHelper {

    private statementParser = new StatementParser();

    read(file: any): [AccountMeta, any[]] {
        const workbook = XLSX.read(file, { type: "buffer" });

        var sheet_name_list = workbook.SheetNames;
        const x = workbook.Sheets[sheet_name_list[0]];
        delete x["!margins"];
        delete x["!merges"];
        delete x["!ref"];
        const rows = this.convertTojson(x);

        const meta = this.statementParser.readMeta(rows);
        return [meta, rows]
    }

    private convertTojson(sheet: XLSX.WorkSheet) {
        // console.log(sheet);
        // console.log(sheet);
        const firstStep: any = [];
        Object.keys(sheet).forEach(it => {
            if (/([a-zA-z]+)(\d+)/g.test(it)) {
                const parts = /([a-zA-z]+)(\d+)/g.exec(it)!;
                // console.log(it, parts, sheet[it])
                if (!firstStep[parts[2]])
                    firstStep[Number(parts[2])] = {};
                firstStep[parts[2]][parts[1]] = sheet[it].v;
            }
        });

        const nextStep = firstStep.filter((it: any) => it != undefined);
        return nextStep;
    }
}