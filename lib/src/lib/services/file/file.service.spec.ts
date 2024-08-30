import * as fsPromises from 'fs/promises';
import { fsMock, InMemoryFs, withFiles } from '../../../testing/mocks/fs';
import { base64ToBuffer, imageBlack10x10Jepg } from '../../../testing/mocks/image';
import { FileService } from './file.service';

jest.mock('fs/promises');
jest.mock('os');

describe('FileService', () => {
    const mockFileSystem: InMemoryFs = {
        'my-file.txt': 'Hello\nWorld!',
        'image.jpeg': base64ToBuffer(imageBlack10x10Jepg),
        'folder1': {
            'folder1': {
                'my-file1.txt': 'Hello\nWorld!',
            },
            'folder1-1': {
                'my-file1-1.txt': 'Hello\nWorld!',
            },
            'my-file1.txt': 'Hello\nWorld!',
            'my-file2.txt': 'Hello\nOuter Space!',
        },
        'folder2': {},
    };

    function setupTest(files: InMemoryFs = mockFileSystem) {
        withFiles(files);
        return { service: FileService.instance() };
    }

    describe('doesFileExists', () => {
        it('should return the file exists', async () => {
            const { service } = setupTest();

            expect(await service.doesFileExist('my-file.txt')).toBe(true);
            expect(await service.doesFileExist('my-file1.txt')).toBe(false);
        });

        it('should throw when an invalid file path is tested for existence', async () => {
            const { service } = setupTest();

            await expect(service.doesFileExist('my-file.invalid')).rejects.toThrow(
                'Invalid file path "my-file.invalid"'
            );
        });
    });

    describe('getFile', () => {
        it('should return the text file contents', async () => {
            const { service } = setupTest();

            const contents = await service.getFile('my-file.txt');
            expect(contents).toEqual('Hello\nWorld!');
        });
        it('should return the binary file contents', async () => {
            const { service } = setupTest();

            const contents = await service.getFile('image.jpeg');
            expect(contents).toEqual(base64ToBuffer(imageBlack10x10Jepg));
        });

        it('should throw an error when file does not exist', async () => {
            const { service } = setupTest({});

            await expect(service.getFile('my-file.txt')).rejects.toThrow('File "my-file.txt" not found');
        });

        it('should throw an error with invalid file path', async () => {
            const { service } = setupTest({});

            await expect(service.getFile('my:file.txt')).rejects.toThrow('Invalid file path "my:file.txt"');
        });
    });

    describe('getFilesInDirectory', () => {
        it('should return map of file contents of directory', async () => {
            const { service } = setupTest();

            let directoryMap = await service.getFilesInDirectory('folder1');
            expect(directoryMap).toEqual(
                expect.objectContaining({
                    'folder1/my-file1.txt': 'Hello\nWorld!',
                    'folder1/my-file2.txt': 'Hello\nOuter Space!',
                })
            );

            directoryMap = await service.getFilesInDirectory('folder1/folder1-1');
            expect(directoryMap).toEqual(
                expect.objectContaining({
                    'folder1/folder1-1/my-file1-1.txt': 'Hello\nWorld!',
                })
            );

            directoryMap = await service.getFilesInDirectory('folder1/folder1');
            expect(directoryMap).toEqual(
                expect.objectContaining({
                    'folder1/folder1/my-file1.txt': 'Hello\nWorld!',
                })
            );
        });

        it('should return empty map when directory is empty', async () => {
            const { service } = setupTest();

            const directoryMap = await service.getFilesInDirectory('folder2');
            expect(directoryMap).toEqual({});
        });

        it('should throw an error when directory does not exist', async () => {
            const { service } = setupTest();

            await expect(service.getFilesInDirectory('folder3')).rejects.toThrow(`Directory "folder3" not found`);
        });
    });

    describe('writeFile', () => {
        it('should create a file from text contents', async () => {
            const { service } = setupTest();

            expect(() => fsMock.readFile('my-file2.txt')).toThrow();

            await service.writeFile('my-file2.txt', 'Hello\nOther World!');
            expect(fsMock.readFile('my-file2.txt')).toEqual('Hello\nOther World!');
        });
        it('should create a file from buffer contents', async () => {
            const { service } = setupTest();
            const imageBuffer = base64ToBuffer(imageBlack10x10Jepg);

            expect(() => fsMock.readFile('my-file2.png')).toThrow();

            await service.writeFile('my-file2.png', imageBuffer);
            expect(fsMock.readFile('my-file2.png')).toEqual(imageBuffer);
        });

        it(`should create the required directories if they don't exist`, async () => {
            const { service } = setupTest();

            expect(() => fsMock.readFile('folder3/folder1/my-file2.txt')).toThrow();

            await service.writeFile('folder3/folder1/my-file2.txt', 'Hello\nOther World!');
            expect(fsMock.readFile('folder3/folder1/my-file2.txt')).toEqual('Hello\nOther World!');
        });

        it('should not overwrite directories', async () => {
            const { service } = setupTest();

            await expect(service.writeFile('folder1/folder1', 'Hello\nOther World!')).rejects.toThrow(
                `Invalid file path "folder1/folder1"`
            );
        });

        it('should fail on unexpected failure on creating text file', async () => {
            const { service } = setupTest();

            jest.spyOn(fsPromises, 'writeFile').mockImplementationOnce(() => Promise.reject(new Error()));

            await expect(service.writeFile('my-file.txt', 'Bla bla bla')).rejects.toThrow(
                'Failed to write text file to disk "my-file.txt"'
            );
        });

        it('should fail on unexpected failure on creating binary file', async () => {
            const { service } = setupTest();

            jest.spyOn(fsPromises, 'writeFile').mockImplementationOnce(() => Promise.reject(new Error()));

            await expect(service.writeFile('my-file.png', base64ToBuffer(imageBlack10x10Jepg))).rejects.toThrow(
                'Failed to write binary file to disk "my-file.png"'
            );
        });

        it('should fail on unexpected failure on creating file directory', async () => {
            const { service } = setupTest();

            jest.spyOn(fsPromises, 'mkdir').mockImplementationOnce(() => Promise.reject(new Error()));

            await expect(service.writeFile('folder4/my-file.txt', 'Bla bla bla')).rejects.toThrow(
                'Failed to create directory "folder4"'
            );
        });
    });
});
