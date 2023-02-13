import { StatementBank } from "../statementParser";
import { FieldType } from "./FieldDetector";
import { AccountRecord, BaseStatement } from "./IStatement";

export class HsbcAccountStatement extends BaseStatement {
    bank: StatementBank = StatementBank.HSBC_BANK_ARMENIA_ACCOUNT;
    static isType(sheet: any[]): boolean {
        return sheet[3].B?.indexOf('HSBC Bank Armenia') >= 0 && sheet[0].D?.indexOf('ACCOUNT STATEMENT') == 0;
    }

    readAccountNumber(rows: any[]): string {
        return this.field(rows[1], 'Q', '0', FieldType.UNKNOWN)
    }

    isValidRecord(row: any): boolean {
        let isStatementRecord = this.fieldDetector.detect(this.field(row, 'B')) == FieldType.Date

        isStatementRecord = isStatementRecord && this.fieldDetector.detect(this.field(row, 'C')) == FieldType.MoneyAmount
        isStatementRecord = isStatementRecord && this.fieldDetector.detect(this.field(row, 'D')) == FieldType.Currency
        isStatementRecord = isStatementRecord && [FieldType.MoneyAmount, FieldType.UNKNOWN].includes(this.fieldDetector.detect(this.field(row, 'E')))
        isStatementRecord = isStatementRecord && [FieldType.MoneyAmount, FieldType.UNKNOWN].includes(this.fieldDetector.detect(this.field(row, 'F')))
        isStatementRecord = isStatementRecord && (this.fieldDetector.detect(this.field(row, 'E')) == FieldType.MoneyAmount || this.fieldDetector.detect(this.field(row, 'F')) == FieldType.MoneyAmount)
        isStatementRecord = isStatementRecord && [FieldType.UNKNOWN].includes(this.fieldDetector.detect(this.field(row, 'J')))
        return isStatementRecord
    }

    makeRecord(row: any): AccountRecord {
        return {
            credit: this.field(row, 'E', 0, FieldType.MoneyAmount),
            debit: this.field(row, 'F', 0, FieldType.MoneyAmount),
            currency: this.field(row, 'D'),
            date: this.field(row, 'B'),
            description: this.field(row, 'J'),
        }
    }
}