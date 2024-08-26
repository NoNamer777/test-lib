import {
    extractDirectoryPath,
    extractFileExtension,
    extractFileName,
    isTextFile,
    isValidFilePath,
    isValidPath,
} from './path';

describe('Path Utils', () => {
    it('should extract the directory path from a file path', () => {
        expect(extractDirectoryPath('folder1/folder2/folder3/file.txt')).toEqual('folder1/folder2/folder3');
    });

    it('should extract the file name from a file path', () => {
        expect(extractFileName('folder1/folder2/folder3/file.txt')).toEqual('file.txt');
    });

    it('should extract the file extension from a file path', () => {
        expect(extractFileExtension('folder1/folder2/folder3/file.txt')).toEqual('txt');
    });

    describe('Valid path', () => {
        it('should be a valid path', () => {
            expect(isValidPath('folder1/folder2/folder3/file.txt')).toBe(true);
        });

        it('should indicate that the file is a text file', () => {
            expect(isTextFile('folder1/folder2/folder3/file.txt')).toBe(true);
            expect(isTextFile('folder1/folder2/folder3/file.png')).toBe(false);
        });

        it('should be a valid file path', () => {
            expect(isValidFilePath('folder1/folder2/folder3/file.txt')).toBe(true);
        });

        it('should be an invalid file path', () => {
            expect(isValidFilePath('folder1/folder2/folder3/file.random')).toBe(false);
            expect(isValidFilePath('folder1/folder2/folder3/')).toBe(false);
            expect(isValidFilePath('folder1/folder2/folder3')).toBe(false);
            expect(isValidFilePath('fol:der/file.txt')).toBe(false);

            let folderPath = '';

            for (let i = 1; i <= 30; i++) folderPath += `folder${i}/`;
            folderPath += 'file.txt';

            expect(isValidFilePath(folderPath)).toEqual(false);
        });
    });
});
