
export enum FieldType {
    Date,
    Currency,
    MoneyAmount,
    Number,
    UNKNOWN
}
export class FieldDetector {

    detect(value: string): FieldType {
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(value)) {
            return FieldType.Date;
        }
        else if (/^((\+|\-)?\ )?(\d+\ ?)+(\,\d+)?$/.test(value)) {
            return FieldType.MoneyAmount;
        }
        else if (/^(\d+\ ?)+$/.test(value)) {
            return FieldType.Number;
        }
        else if (value == 'AMD' || value == 'USD' || value == 'EURO') {
            return FieldType.Currency;
        }
        return FieldType.UNKNOWN
    }


}