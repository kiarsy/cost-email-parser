export type StatementFile = {
    name: string;
    size: number;
    type: string;
    path: string;
};

export class FileParser {
    isXlsx(file: StatementFile) {
        return (file.name.endsWith('xlsx'))
    }
}
