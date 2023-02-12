import { AmeriaStatement } from "./statements/AmeriaStatement";
import { AccountRecord, IStatement } from "./statements/IStatement";

export enum StatementBank {
    AMERIA_BANK = 'AMERIA',
    HSBC_BANK = 'HSBC',
    UNKNOWN = 'UNKNOWN'
}

export type AccountMeta = {
    bank: StatementBank,
    accountNumber: string
}
export class StatementParser implements IStatement {


    readMeta(rows: any[]): AccountMeta {
        if (rows[4].A.indexOf('ameriabank.am') >= 0) {
            return {
                bank: StatementBank.AMERIA_BANK,
                accountNumber: new AmeriaStatement().readAccountNumber(rows)
            };
        }
        return {
            bank: StatementBank.UNKNOWN,
            accountNumber: ''
        };
    }

    readAll(sheet: any[]): AccountRecord[] {
        switch (this.readMeta(sheet).bank) {
            case StatementBank.AMERIA_BANK:
                return new AmeriaStatement().readAll(sheet);
        }
        return [];
    }
}