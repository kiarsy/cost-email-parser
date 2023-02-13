import { AmeriaStatement } from "./statements/AmeriaStatement";
import { HsbcStatement } from "./statements/HsbcStatement";
import { AccountRecord, IStatement } from "./statements/IStatement";

export enum StatementBank {
    AMERIA_BANK = 'AMERIA',
    HSBC_BANK_ARMENIA = 'HSBC_ARMENIA',
    UNKNOWN = 'UNKNOWN'
}

export type AccountMeta = {
    bank: StatementBank,
    accountNumber: string
}
export class StatementParser implements IStatement {


    readMeta(rows: any[]): AccountMeta {
        if (rows[4].A?.indexOf('ameriabank.am') >= 0) {
            return {
                bank: StatementBank.AMERIA_BANK,
                accountNumber: new AmeriaStatement().readAccountNumber(rows)
            };
        }
        else if (rows[3].B?.indexOf('HSBC Bank Armenia cjsc') >= 0) {
            return {
                bank: StatementBank.HSBC_BANK_ARMENIA,
                accountNumber: new HsbcStatement().readAccountNumber(rows)
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

            case StatementBank.HSBC_BANK_ARMENIA:
                return new HsbcStatement().readAll(sheet);
        }
        return [];
    }
}