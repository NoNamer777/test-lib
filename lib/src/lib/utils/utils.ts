import { platform } from 'process';

export const isRunningOnWindows = () => platform === 'win32';

export const isRunningOnMac = () => platform === 'darwin';

export const jsonToString = (contents: unknown) => JSON.stringify(contents, null, 4);

export const isArrayEmpty = (array: unknown[]) => array.length === 0;
