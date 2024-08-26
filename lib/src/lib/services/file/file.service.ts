import { access, lstat, mkdir, readdir, readFile, writeFile } from 'fs/promises';
import { normalize } from 'path';
import { extractDirectoryPath, isBinaryFile, isTextFile, isValidFilePath, isValidPath } from '../../utils';

export class FileService {
    public static instance() {
        if (!this._instance) this._instance = new FileService();
        return this._instance;
    }
    private static _instance: FileService;

    public async getFile(filePath: string) {
        if (!isValidPath(filePath)) throw new Error(`Invalid file path "${filePath}"`);
        try {
            if (isBinaryFile(filePath)) {
                return await readFile(filePath);
            }
            return await readFile(filePath, { encoding: 'utf-8' });
        } catch (_error) {
            throw new Error(`File "${filePath}" not found`);
        }
    }

    public async getFilesInDirectory(directoryPath: string) {
        let fileNames: string[] = [];

        try {
            fileNames = [...(await readdir(directoryPath, { encoding: 'utf-8' }))];
        } catch (_error) {
            throw new Error(`Directory "${directoryPath}" not found`);
        }
        fileNames = fileNames.map((name) => normalize(`${directoryPath}/${name}`));
        const fileContents = await Promise.all(fileNames.map((filePath) => this.getFile(filePath)));

        return fileNames.reduce(
            (map, fileName, idx) => {
                map[fileName] = fileContents[idx];
                return map;
            },
            {} as Record<string, string | Buffer>
        );
    }

    public async writeFile(filePath: string, contents: string | Buffer) {
        if (!isValidFilePath(filePath)) throw new Error(`Invalid file path "${filePath}"`);
        const directoryPath = extractDirectoryPath(filePath);

        if (!(await this.directoryExists(directoryPath))) {
            await this.createDirectory(directoryPath);
        }
        if (isTextFile(filePath)) {
            await this.writeTextFile(filePath, contents as string);
        } else if (isBinaryFile(filePath)) {
            await this.writeBufferFile(filePath, contents as Buffer);
        }
    }

    public async doesFileExist(filePath: string) {
        if (!isValidFilePath(filePath)) throw new Error(`Invalid file path "${filePath}"`);

        try {
            await access(filePath);
            return true;
        } catch (_error) {
            return false;
        }
    }

    private async writeTextFile(filePath: string, contents: string) {
        try {
            await writeFile(filePath, contents, { encoding: 'utf-8' });
        } catch (_error) {
            throw new Error(`Failed to write text file to disk "${filePath}"`);
        }
    }

    private async writeBufferFile(filePath: string, contents: Buffer) {
        try {
            await writeFile(filePath, contents);
        } catch (_error) {
            throw new Error(`Failed to write binary file to disk "${filePath}"`);
        }
    }

    private async directoryExists(directoryPath: string) {
        try {
            const stats = await lstat(directoryPath);
            return stats.isDirectory() || stats.isSymbolicLink();
        } catch (_error) {
            return false;
        }
    }

    private async createDirectory(directoryPath: string) {
        try {
            await mkdir(directoryPath, { recursive: true });
        } catch (_error) {
            throw new Error(`Failed to create directory "${directoryPath}"`);
        }
    }
}
