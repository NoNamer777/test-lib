export type ValidOperatingSystem = 'darwin' | 'win32';

export let operatingSystem: ValidOperatingSystem;

export const withOperatingSystem = (os: ValidOperatingSystem = 'darwin') => (operatingSystem = os);

export const resetOperatingSystem = () => (operatingSystem = 'darwin');
