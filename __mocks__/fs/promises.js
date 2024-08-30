// eslint-disable-next-line @typescript-eslint/no-require-imports
const { fsMock } = require("../../lib/src/testing/mocks/fs");

const fsPromisesMock = jest.createMockFromModule('fs/promises');

fsPromisesMock.access = jest.fn(async (filePath) => {
    if (fsMock.fileExists(filePath)) return;
    throw new Error();
});

fsPromisesMock.lstat = jest.fn(async (directoryPath) => ({
    isDirectory: () => fsMock.directoryExists(directoryPath),
}));

fsPromisesMock.mkdir = jest.fn(async (directoryPath) => fsMock.createDirectory(directoryPath));

fsPromisesMock.readdir = jest
    .fn(async (directoryPath) => fsMock.getFileNamesInDirectory(directoryPath));

fsPromisesMock.readFile = jest.fn(async (filePath) => {
    const contents = fsMock.readFile(filePath);

    if (!contents) throw new Error();
    return contents;
});

fsPromisesMock.writeFile = jest.fn(async (filePath, contents) => fsMock.writeFile(filePath, contents));

module.exports = fsPromisesMock;
