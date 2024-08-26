// eslint-disable-next-line @typescript-eslint/no-require-imports
const { operatingSystem } = require('../lib/src/testing/mocks');

const os = jest.createMockFromModule('os');

os.platform = jest.fn(() => operatingSystem);

os.homedir = jest.fn(() => 'home');

module.exports = os;
