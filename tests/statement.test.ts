import { assert } from "console";
import { AmeriaStatement } from "../src/statements/AmeriaStatement";
import { HsbcStatement } from "../src/statements/HsbcStatement";



describe('Ameria Statement checker', () => {
    const statement = new AmeriaStatement();
    test('isValid = true ', () => {
        const row = {
            A: '01.11.2022',
            B: '1 999,00',
            C: 'AMD',
            D: '+ 1 999,00',
            F: '',
            H: '',
            J: '01.11.2022',
            L: '',
            O: '% կապիտ. ըստ 83281530100 հաշվի Ամերիաբանկ ՓԲԸ Գլխամասային գրասենյակ'
        };
        let result = statement.isValidRecord(row);
        expect(result).toBe(true);
        let result2 = statement.makeRecord(row);
        expect(result2.credit).toBe(1999.00);
        expect(result2.debit).toBe(0);
    });

    test('isValid = true ', () => {
        const row = {
            A: '01.11.2022',
            B: '999,00',
            C: 'AMD',
            D: '+ 999,00',
            F: '',
            H: '',
            J: '01.11.2022',
            L: '',
            O: '% կապիտ. ըստ 83281530100 հաշվի Ամերիաբանկ ՓԲԸ Գլխամասային գրասենյակ'
        };
        let result = statement.isValidRecord(row);
        expect(result).toBe(true);
        let result2 = statement.makeRecord(row);
        expect(result2.credit).toBe(999.00);
        expect(result2.debit).toBe(0);
    });

    test('isValid = true ', () => {
        const row = {
            A: '01.11.2022',
            B: '199,90',
            C: 'AMD',
            D: '',
            F: '- 199,90',
            H: '',
            J: '01.11.2022',
            L: '',
            O: 'Հարկի(Tax) պահում ըստ 83281530100 Ամերիաբանկ ՓԲԸ Գլխամասային գրասենյակ'
        };
        let result = statement.isValidRecord(row);
        expect(result).toBe(true);
        let result2 = statement.makeRecord(row);
        expect(result2.credit).toBe(0);
        expect(result2.debit).toBe(199.90);
    });

    test('isValid = true ', () => {
        const row = {
            A: '31.10.2022',
            B: '10 000,00',
            C: 'AMD',
            D: '',
            F: '- 10 000,00',
            H: '',
            J: '01.11.2022',
            L: '',
            O: 'Ք: Քարտից քարտ փոխանցում CABINET ARCA.\\Debit part YEREVAN AM 657828'
        };
        let result = statement.isValidRecord(row);
        expect(result).toBe(true);
        let result2 = statement.makeRecord(row);
        expect(result2.credit).toBe(0);
        expect(result2.debit).toBe(10000.00);
    });


    test('isValid = true ', () => {
        const row = {
            A: '01.11.2022',
            B: '30,00',
            C: 'AMD',
            D: '',
            F: '- 30,00',
            H: '',
            J: '01.11.2022',
            L: '',
            O: 'Ք: Գանձում փոխանցման համար Ամերիաբանկ ՓԲԸ Գլխամասային գրասենյակ'
        };
        let result = statement.isValidRecord(row);
        expect(result).toBe(true);
        let result2 = statement.makeRecord(row);
        expect(result2.credit).toBe(0);
        expect(result2.debit).toBe(30.00);
    });


    test('isValid = true ', () => {
        const row = {
            A: '01.11.2022',
            B: '1 999,00',
            C: 'AMD',
            D: '+ 1 999,00',
            F: '',
            H: '',
            J: '01.11.2022',
            L: '',
            O: '% կապիտ. ըստ 83281530100 հաշվի Ամերիաբանկ ՓԲԸ Գլխամասային գրասենյակ'
        };
        let result = statement.isValidRecord(row);
        expect(result).toBe(true);
        let result2 = statement.makeRecord(row);
        expect(result2.credit).toBe(1999.00);
        expect(result2.debit).toBe(0);
    });


    test('isValid = false ', () => {
        const row = {
            A: '01.11.2022',
            B: '30,00',
            C: 'AMD',
            D: '',
            F: '',
            H: '',
            J: '01.11.2022',
            L: '',
            O: 'Ք: Գանձում փոխանցման համար Ամերիաբանկ ՓԲԸ Գլխամասային գրասենյակ'
        };
        let result = statement.isValidRecord(row);
        expect(result).toBe(false);
    });
});

describe('HSBC Statement checker', () => {
    const statement = new HsbcStatement();
    test('isValid = false ', () => {
        const row = {
            B: '04.01.2023',
            C: '4,064.28',
            D: 'AMD',
            E: '',
            F: '',
            H: '',
            I: '04.01.2023',
            J: '',
            K: 'Hold \\ PAYPAL *UDEMY                            \\  4029357733 US'
        };
        let result = statement.isValidRecord(row);
        expect(result).toBe(false);
    });

    test('isValid = true ', () => {
        const row = {
            B: '03.01.2023',
            C: '4,064.28',
            D: 'AMD',
            E: '',
            F: '-4,064.28',
            H: '',
            I: '07.01.2023',
            J: '',
            K: 'Purchase transaction  \\ 00000001\\USA\\4029357733\\60\\PAYPAL *UDEMY'
        };
        let result = statement.isValidRecord(row);
        expect(result).toBe(true);
        let result2 = statement.makeRecord(row);
        expect(result2.credit).toBe(0);
        expect(result2.debit).toBe(4064.28);
    });

    test('isValid = true ', () => {
        const row = {
            B: '14.01.2023',
            C: '100.00',
            D: 'AMD',
            E: '',
            F: '-100.00',
            H: '',
            I: '15.01.2023',
            J: '',
            K: 'Purchase transaction \\ 22533215\\AM\\YEREVAN\\UPAY  E-WALLE'
        };
        let result = statement.isValidRecord(row);
        expect(result).toBe(true);
        let result2 = statement.makeRecord(row);
        expect(result2.credit).toBe(0);
        expect(result2.debit).toBe(100.00);
    });

    test('isValid = true ', () => {
        const row = {
            B: '03.01.2023',
            C: '4,064.28',
            D: 'AMD',
            E: '',
            F: '-4,064.28',
            H: '',
            I: '07.01.2023',
            J: '',
            K: 'Purchase transaction  \\ 00000001\\USA\\4029357733\\60\\PAYPAL *UDEMY'
        };
        let result = statement.isValidRecord(row);
        expect(result).toBe(true);
        let result2 = statement.makeRecord(row);
        expect(result2.credit).toBe(0);
        expect(result2.debit).toBe(4064.28);
    });
});