const osMock = jest.createMockFromModule('os');

osMock.homedir = jest.fn(() => 'home');

module.exports = osMock;
