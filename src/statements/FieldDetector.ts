
export enum FieldType {
    Date = 1,
    Currency =2,
    MoneyAmount =3,
    Number =4,
    UNKNOWN = -100
}

export class FieldDetector {

    detect(value: string): FieldType {
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(value)) {
            return FieldType.Date;
        }
        else if (/^(\+|\-)?(\s){0,1}(((\d)+(\,|\s){0,1}))+(\.|\,)?(\d){0,2}$/.test(value)) {
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