export type ValidOperatingSystem = 'darwin' | 'win32';

export let operatingSystem: ValidOperatingSystem = 'darwin';

export function withOperatingSystem(os: ValidOperatingSystem = 'darwin') {
    operatingSystem = os;
}

export function resetOperatingSystem() {
    operatingSystem = 'darwin';
}
