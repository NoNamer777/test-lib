const osMock = jest.createMockFromModule('os');

const os = jest.createMockFromModule('os');

os.platform = jest.fn(() => operatingSystem);

os.homedir = jest.fn(() => 'home');

module.exports = os;
