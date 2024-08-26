import { ValidOperatingSystem, withOperatingSystem } from '@/testing';
import { isRunningOnMac, isRunningOnWindows } from './utils';

jest.mock('os');

describe('Utils', () => {
    function setupTest(os?: ValidOperatingSystem) {
        if (os) withOperatingSystem(os);
    }

    it('should indicate that the current OS is mac', () => {
        setupTest();

        expect(isRunningOnWindows()).toEqual(false);
        expect(isRunningOnMac()).toEqual(true);
    });

    // TODO: Fix test
    //  For some reason the os mock is not being applied correctly.
    //  Within the unit test, when using the "platform" function directly inside the test, it returns the mocked value,
    //  but the actual implementation of the functions "isRunningOnWindows" and "isRunningOnMac",
    //  which use the "platform" function, don't return the mocked value
    //  thus resulting in a test failure. The mock is applied, it just doesn't register somehow
    it('should indicate that the current OS is Windows', () => {
        setupTest('win32');

        expect(isRunningOnWindows()).toEqual(true);
        expect(isRunningOnMac()).toEqual(false);
    });
});
