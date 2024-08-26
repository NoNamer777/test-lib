import { fsMock, InMemoryFs, withFiles, withOperatingSystem } from '@/testing';
import * as fsPromises from 'fs/promises';
import { ConfigService } from './config.service';
import { AppConfig, defaultConfig } from './models';

jest.mock('fs/promises');
jest.mock('os');

type ExactConfigProvider = { value: AppConfig };

type ConfigContentProvider = {
    configContents: string;
    configPath: string;
};

interface TestParams {
    config?: ExactConfigProvider | ConfigContentProvider;
}

describe('ConfigService', () => {
    async function setupTest(params: TestParams = {}) {
        withOperatingSystem();

        const fileSystemState: InMemoryFs = {};

        if (params.config) {
            const configPath = Object.keys(params.config).includes('value')
                ? `${(params.config as ExactConfigProvider).value.baseAppDataDirectoryPath}/config.json`
                : (params.config as ConfigContentProvider).configPath;

            fileSystemState[configPath] = Object.keys(params.config).includes('value')
                ? JSON.stringify((params.config as ExactConfigProvider).value)
                : (params.config as ConfigContentProvider).configContents;

            withFiles(fileSystemState);
        } else {
            withFiles();
        }

        const service = ConfigService.instance();

        return { service };
    }

    async function setupAndInitialize(params: TestParams = {}) {
        const testObjects = await setupTest(params);
        await testObjects.service.initialize();

        return { ...testObjects };
    }

    it('should create a new config file when not found on the filesystem', async () => {
        const { service } = await setupTest();

        expect(fsMock.directoryExists('home/Library/Application Support/studio-desktop-app')).toBe(false);

        await service.initialize();

        const config = JSON.parse(
            fsMock.readFile(`${service.getSetting('baseAppDataDirectoryPath')}/config.json`) as string
        );

        expect(config).toBeDefined();
    });

    it('should use the existing config file on the filesystem', async () => {
        const { service } = await setupAndInitialize({ config: { value: { ...defaultConfig, locale: 'nlNL' } } });

        const storedConfig = JSON.parse(
            fsMock.readFile('home/Library/Application Support/studio-desktop-app/config.json') as string
        );

        expect(service.getSetting('locale')).toBe(storedConfig.locale);
    });

    it('should fail when failing to read config from file unexpectedly', async () => {
        const { service } = await setupTest({ config: { value: { ...defaultConfig, locale: 'nlNL' } } });

        jest.spyOn(fsPromises, 'readFile').mockImplementationOnce(() => Promise.reject(new Error()));

        await expect(service.initialize()).rejects.toThrow('Failed to read config file');
    });

    it('should throw an error when an existing config file has invalid format', async () => {
        const { service } = await setupTest({
            config: {
                configContents: '{ "invalidJson"',
                configPath: 'home/Library/Application Support/studio-desktop-app/config.json',
            },
        });

        await expect(service.initialize()).rejects.toThrow('Received invalid value from disk. Must be JSON object.');
    });

    it('should throw an error when an existing config file is incomplete', async () => {
        const { service } = await setupTest({
            config: {
                value: {
                    baseAppDataDirectoryPath: 'home/Library/Application Support/studio-desktop-app',
                    locale: 'enUS',
                },
            },
        });

        await expect(service.initialize()).rejects.toThrow('Received invalid app config from disk.');
    });

    it('should update a setting', async () => {
        const { service } = await setupAndInitialize();
        let storedConfig = JSON.parse(
            fsMock.readFile(`${service.getSetting('baseAppDataDirectoryPath')}/config.json`) as string
        );

        expect(storedConfig.locale).toBe('enUS');
        expect(service.getSetting('locale')).toBe('enUS');

        await service.updateSetting('locale', 'nlNL');

        expect(service.getSetting('locale')).toBe('nlNL');

        storedConfig = JSON.parse(
            fsMock.readFile(`${service.getSetting('baseAppDataDirectoryPath')}/config.json`) as string
        );
        expect(storedConfig.locale).toBe('nlNL');
    });
});
