import { operatingSystem } from '../lib/src/testing/mocks';

const process = jest.createMockFromModule('process');

process.cwd = jest.fn(() => 'app');

process.platform = jest.fn().mockReturnValue(operatingSystem);

export default process;
