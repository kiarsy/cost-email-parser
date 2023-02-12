import { File,  Storage } from "@google-cloud/storage";

export class StorageControl {
    storage: Storage;
    constructor(projectId: string, readonly bucketName: string) {
        this.storage = new Storage({
            projectId
        });
    }

    async downloadToBuffer(fileName: string): Promise<Buffer> {
        const file = this.storage.bucket(this.bucketName).file(fileName);
        const fileBuffer = await file.download();
        return fileBuffer[0];
    }

}