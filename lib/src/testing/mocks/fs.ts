import { extractDirectoryPath, extractFileName } from '../../lib/utils/path/path';
import { isArrayEmpty } from '../../lib/utils/utils';

export interface InMemoryFs {
    [key: string]: string | Buffer | InMemoryFs;
}

class MockFs {
    private files: InMemoryFs = {};

    public readFile(filePath: string) {
        const directory = this.getDirectory(extractDirectoryPath(filePath));
        const file = directory[extractFileName(filePath)];

        if (!this.entryExists(file) || !this.isFile(file)) throw new Error();
        return file;
    }

    public writeFile(filePath: string, contents: string) {
        const directoryPath = extractDirectoryPath(filePath);
        let directory: InMemoryFs;

        try {
            directory = this.getDirectory(directoryPath);
        } catch (_error) {
            directory = this.createDirectory(directoryPath);
        }
        if (this.entryExists(directory[filePath]) && !this.isFile(directory[filePath])) throw new Error();
        directory[extractFileName(filePath)] = contents;
    }

    public removeFile(filePath: string) {
        const directory = this.getDirectory(extractDirectoryPath(filePath));
        const fileName = extractFileName(filePath);

        if (!this.entryExists(directory[fileName]) || !this.isFile(directory[fileName])) throw new Error();
        delete directory[fileName];
    }

    /** Returns a list of names of files in a directory. */
    public getFileNamesInDirectory(directoryPath: string) {
        const directory = this.getDirectory(directoryPath);
        return Object.entries(directory)
            .filter(([_name, entry]) => this.isFile(entry))
            .map(([name]) => name);
    }

    /**
     * Recursively creates a directory tree. Will check for already existing an entries and use those when
     * they are directories themselves or throw an error when it's a file.
     *
     * @example
     * // Results in { folder: { subfolder: { subSubFolder: {} } } }
     * createDirectory('folder/subfolder/subSubfolder')
     *
     * @return The directory that was created.
     */
    public createDirectory(directoryPath: string) {
        const directories = this.parseDirectoryPath(directoryPath);
        let directory = this.files;

        for (const subDirectory of directories) {
            if (!this.entryExists(directory[subDirectory])) directory[subDirectory] = {};
            if (this.isFile(directory[subDirectory])) throw new Error();
            directory = directory[subDirectory];
        }
        return directory;
    }

    public fileExists(filePath: string) {
        try {
            return Boolean(this.readFile(filePath));
        } catch (_error) {
            return false;
        }
    }

    public directoryExists(directoryPath: string) {
        try {
            return Boolean(this.getDirectory(directoryPath));
        } catch (_error) {
            return false;
        }
    }

    public reset(files: InMemoryFs = {}) {
        const entries = Object.entries(files);

        if (isArrayEmpty(entries)) {
            this.files = {};
            return;
        }
        for (const [key, value] of entries) {
            if (!key.includes('/')) continue;

            delete files[key];

            const pathParts = extractDirectoryPath(key).split('/');
            const fileName = extractFileName(key);
            let directory = files;

            for (const part of pathParts) {
                if (!directory[part]) directory[part] = {};
                directory = directory[part] as InMemoryFs;
            }
            directory[fileName] = value;
        }
        this.files = { ...files };
    }

    /** Traverses the directory tree until it reaches its target directory and returns it. */
    private getDirectory(directoryPath: string) {
        const directories = this.parseDirectoryPath(directoryPath);
        let directory = this.files;

        for (const subDirectory of directories) {
            const directoryEntry = directory[subDirectory];

            if (!this.entryExists(directoryEntry) || this.isFile(directoryEntry)) throw new Error();
            directory = directoryEntry;
        }
        return directory;
    }

    private parseDirectoryPath(directoryPath: string) {
        const parts = directoryPath.split('/');
        return parts.length > 1 || parts[0] !== '' ? parts : [];
    }

    private entryExists(directoryEntry?: string | Buffer | InMemoryFs) {
        return Boolean(directoryEntry);
    }

    private isFile(directoryEntry: string | Buffer | InMemoryFs) {
        return Buffer.isBuffer(directoryEntry) || typeof directoryEntry === 'string';
    }
}

export const withFiles = (files: InMemoryFs = {}) => fsMock.reset(files);

export const fsMock = new MockFs();
