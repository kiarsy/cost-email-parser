import XLSX from 'xlsx'
import { AccountMeta, StatementParser } from './statementParser';

export class XlsxHelper {

    private statementParser = new StatementParser();

    read(file: any): [AccountMeta, any[]] {
        const workbook = XLSX.read(file, { type: "buffer" });
        var sheet_name_list = workbook.SheetNames;
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        const meta = this.statementParser.readMeta(sheet);
        return [meta, sheet]
    }
}