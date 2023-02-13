import { StatementBank } from "../statementParser";
import { FieldType } from "./FieldDetector";
import { AccountRecord, BaseStatement } from "./IStatement";

export class AmeriaStatement extends BaseStatement {
    bank: StatementBank = StatementBank.AMERIA_BANK;

    static isType(sheet: any[]): boolean {
        return sheet[4].A?.indexOf('ameriabank.am') >= 0;
    }

    readAccountNumber(rows: any[]): string {
        return this.field(rows[2], 'Q', '0', FieldType.Number)
    }

    isValidRecord(row: any): boolean {
        let isStatementRecord = this.fieldDetector.detect(this.field(row, 'A')) == FieldType.Date
        isStatementRecord = isStatementRecord && this.fieldDetector.detect(this.field(row, 'B')) == FieldType.MoneyAmount
        isStatementRecord = isStatementRecord && this.fieldDetector.detect(this.field(row, 'C')) == FieldType.Currency
        isStatementRecord = isStatementRecord && [FieldType.MoneyAmount, FieldType.UNKNOWN].includes(this.fieldDetector.detect(this.field(row, 'D')))
        isStatementRecord = isStatementRecord && [FieldType.MoneyAmount, FieldType.UNKNOWN].includes(this.fieldDetector.detect(this.field(row, 'F')))
        isStatementRecord = isStatementRecord && (this.fieldDetector.detect(this.field(row, 'F')) == FieldType.MoneyAmount || this.fieldDetector.detect(this.field(row, 'D')) == FieldType.MoneyAmount)
        isStatementRecord = isStatementRecord && [FieldType.UNKNOWN].includes(this.fieldDetector.detect(this.field(row, 'O')))
        return isStatementRecord
    }

    makeRecord(row: any): AccountRecord {
        return {
            credit: this.field(row, 'D', 0, FieldType.MoneyAmount),
            debit: this.field(row, 'F', 0, FieldType.MoneyAmount),
            currency: this.field(row, 'C'),
            date: this.field(row, 'A'),
            description: this.field(row, 'O'),
        }
    }
}