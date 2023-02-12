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


    readMeta(sheet: any[]): AccountMeta {
        if (sheet[4].__EMPTY.indexOf('ameriabank.am') >= 0) {
            return {
                bank: StatementBank.AMERIA_BANK,
                accountNumber: new AmeriaStatement().readAccountNumber(sheet)
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