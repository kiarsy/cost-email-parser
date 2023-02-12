import { Files } from 'formidable'

export type StatementFile = {
    name: string;
    size: number;
    type: string;
    path: string;
};

export class FileParser {
    isXlsx(file: StatementFile) {
        console.log(file);
        return (file.name.endsWith('xlsx'))
    }
}
