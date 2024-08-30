// eslint-disable-next-line @typescript-eslint/no-require-imports
const { operatingSystem } = require('../lib/src/testing/mocks/os');

const processMock = jest.createMockFromModule('process');

processMock.cwd = jest.fn(() => 'app');

processMock.platform = jest.fn(() => operatingSystem);

module.exports = processMock;
