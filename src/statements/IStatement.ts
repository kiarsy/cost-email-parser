import { FieldDetector, FieldType } from "./FieldDetector";

export type AccountRecord = {
    description: string,
    date: string,
    debit: string,
    credit: string,
    currency: string
}
export interface IStatement {
    readAll(sheet: any[]): AccountRecord[];
}

export abstract class BaseStatement implements IStatement {
    fieldDetector = new FieldDetector();

    readAll(sheet: any[]): AccountRecord[] {
        const statementRecords = sheet.filter(this.isValidRecord.bind(this))
        const records: AccountRecord[] = statementRecords.map(this.makeRecord.bind(this));

        return records;
    }

    abstract isValidRecord(row: any): boolean;
    abstract makeRecord(row: any): AccountRecord;

    field(row: any, col: string|number, defaultValue?: any, type?: FieldType): any {
        const val = row[col];
        return this.convertValue((val != '' || defaultValue == undefined) ? val : defaultValue, type);
    }

    convertValue(value: any, type?: FieldType): any {
        if (!type)
            return value;
        if (type == FieldType.MoneyAmount) {
            const splitter = /(.)\d{2}$/g.exec(value);
            let splitterChar = ''
            if (splitter)
                splitterChar = splitter[1];
            value = String(value).replace(/\ /g, '').replace('-', '').replace('+', '');
            value = value.replace(splitterChar, 'X');
            value = value.replace(',', '');
            value = value.replace('X', '.');
            value = parseFloat(value);
        }
        if (type == FieldType.Number) {
            value = String(value).replace(/\ /g, '').replace(',', '');
            value = parseFloat(value);
        }

        return value;
    }

    abstract readAccountNumber(sheet: any[]): string
}