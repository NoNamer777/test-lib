import {fsMock} from "../../lib/src/testing/mocks";

const promises = jest.createMockFromModule('fs/promises');

promises.access = jest.fn(async (filePath) => {
    if (fsMock.fileExists(filePath)) return;
    throw new Error();
});

promises.lstat = jest.fn(async (directoryPath) => ({
    isDirectory: () => fsMock.directoryExists(directoryPath),
}));

promises.mkdir = jest.fn(async (directoryPath) => fsMock.createDirectory(directoryPath));

promises.readdir = jest
    .fn(async (directoryPath) => fsMock.getFileNamesInDirectory(directoryPath));

promises.readFile = jest.fn(async (filePath) => {
    const contents = fsMock.readFile(filePath);

    if (!contents) throw new Error();
    return contents;
});

promises.writeFile = jest.fn(async (filePath, contents) => fsMock.writeFile(filePath, contents));

export default promises;
