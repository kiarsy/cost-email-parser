import { AmeriaStatement } from "./statements/AmeriaStatement";
import { HsbcAccountStatement } from "./statements/HsbcAccountStatement";
import { HsbcCardStatement } from "./statements/HsbcCardStatement";
import { AccountRecord, IStatement } from "./statements/IStatement";

export enum StatementBank {
    AMERIA_BANK = 'AMERIA',
    HSBC_BANK_ARMENIA = 'HSBC_ARMENIA',
    HSBC_BANK_ARMENIA_CARD = 'HSBC_ARMENIA_CARD',
    HSBC_BANK_ARMENIA_ACCOUNT = 'HSBC_ARMENIA_ACCOUNT',

    UNKNOWN = 'UNKNOWN'
}

export type AccountMeta = {
    bank: StatementBank,
    accountNumber: string
}

export class StatementParser implements IStatement {
    readAll(sheet: any[]): AccountRecord[] {
        if (AmeriaStatement.isType(sheet)) {
            return new AmeriaStatement().readAll(sheet);
        }
        if (HsbcCardStatement.isType(sheet)) {
            return new HsbcCardStatement().readAll(sheet);
        }
        if (HsbcAccountStatement.isType(sheet)) {
            return new HsbcAccountStatement().readAll(sheet);
        }
        return [];
    }

    readMeta(sheet: any[]): AccountMeta {
        if (AmeriaStatement.isType(sheet)) {
            return new AmeriaStatement().readMeta(sheet);
        }
        if (HsbcCardStatement.isType(sheet)) {
            return new HsbcCardStatement().readMeta(sheet);
        }
        if (HsbcAccountStatement.isType(sheet)) {
            return new HsbcAccountStatement().readMeta(sheet);
        }
        return { accountNumber: '', bank: StatementBank.UNKNOWN };
    }
}