import { operatingSystem } from '../lib/src/testing/mocks';

const os = jest.createMockFromModule('os');

os.platform = jest.fn(() => operatingSystem);

os.homedir = jest.fn(() => 'home');

export default os;
