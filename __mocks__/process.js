// eslint-disable-next-line @typescript-eslint/no-require-imports
const { operatingSystem } = require('../lib/src/testing/mocks');

const process = jest.createMockFromModule('process');

process.cwd = jest.fn(() => 'app');

process.platform = jest.fn().mockReturnValue(operatingSystem);

module.exports = process;
