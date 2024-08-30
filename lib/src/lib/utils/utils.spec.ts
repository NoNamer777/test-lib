import { ValidOperatingSystem, withOperatingSystem } from '../../testing/mocks/os';
import { isArrayEmpty, isRunningOnMac, isRunningOnWindows } from './utils';

jest.mock('process');

describe('Utils', () => {
    function setupTest(os?: ValidOperatingSystem) {
        if (os) withOperatingSystem(os);
    }

    it('should indicate that the current OS is mac', () => {
        setupTest();

        expect(isRunningOnWindows()).toEqual(false);
        expect(isRunningOnMac()).toEqual(true);
    });

    it('should indicate that the current OS is Windows', () => {
        setupTest('win32');

        expect(isRunningOnWindows()).toEqual(true);
        expect(isRunningOnMac()).toEqual(false);
    });

    it('should return that array is empty', () => {
        expect(isArrayEmpty([])).toEqual(true);
        expect(isArrayEmpty(['test'])).toEqual(false);
    });
});
