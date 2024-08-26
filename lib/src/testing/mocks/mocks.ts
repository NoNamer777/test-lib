import { fsMock } from './fs';
import { resetOperatingSystem } from './os';

export function resetMocks() {
    resetOperatingSystem();
    fsMock.reset();
}
