import { FieldType } from "./FieldDetector";
import { AccountRecord, BaseStatement } from "./IStatement";

export class AmeriaStatement extends BaseStatement {
    readAccountNumber(sheet: any[]): string {
        return this.field(sheet[2], 3, '0', FieldType.Number)
    }

    isValidRecord(row: any): boolean {
        let isStatementRecord = this.fieldDetector.detect(this.field(row, 0)) == FieldType.Date

        isStatementRecord = isStatementRecord && this.fieldDetector.detect(this.field(row, 1)) == FieldType.MoneyAmount
        isStatementRecord = isStatementRecord && this.fieldDetector.detect(this.field(row, 2)) == FieldType.Currency
        isStatementRecord = isStatementRecord && [FieldType.MoneyAmount, FieldType.UNKNOWN].includes(this.fieldDetector.detect(this.field(row, 3)))
        isStatementRecord = isStatementRecord && [FieldType.MoneyAmount, FieldType.UNKNOWN].includes(this.fieldDetector.detect(this.field(row, 4)))
        isStatementRecord = isStatementRecord && (this.fieldDetector.detect(this.field(row, 3)) == FieldType.MoneyAmount || this.fieldDetector.detect(this.field(row, 4)) == FieldType.MoneyAmount)
        isStatementRecord = isStatementRecord && [FieldType.Date].includes(this.fieldDetector.detect(this.field(row, 6)))
        isStatementRecord = isStatementRecord && [FieldType.UNKNOWN].includes(this.fieldDetector.detect(this.field(row, 8)))
        return isStatementRecord
    }

    makeRecord(row: any): AccountRecord {
        return {
            credit: this.field(row, 3, 0, FieldType.MoneyAmount),
            debit: this.field(row, 4, 0, FieldType.MoneyAmount),
            currency: this.field(row, 2),
            date: this.field(row, 0),
            description: this.field(row, 8),
        }
    }
}