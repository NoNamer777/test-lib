import { join } from 'path';
import { jsonToString } from '../../utils/utils';
import { FileService } from '../file/file.service';
import { AppConfig, AppConfigSchema, AppSetting, defaultConfig } from './models';

export class ConfigService {
    public static instance() {
        if (!this._instance) this._instance = new ConfigService();
        return this._instance;
    }
    private static _instance: ConfigService;

    private readonly fileService = FileService.instance();

    private config: AppConfig;

    private readonly configPath = join(defaultConfig.baseAppDataDirectoryPath, 'config.json');

    public async initialize() {
        await this.readConfigFromFile();
    }

    public getSetting(key: AppSetting) {
        return this.config[key];
    }

    public async updateSetting<K extends AppSetting>(key: K, value: AppConfig[K]) {
        this.config[key] = value;
        await this.writeConfigToDisk();
    }

    private async readConfigFromFile() {
        let fileContents: string;

        try {
            fileContents = (await this.fileService.getFile(this.configPath)) as string;
        } catch (_error) {
            if (!(await this.fileService.doesFileExist(this.configPath))) {
                this.config = { ...defaultConfig };
                await this.writeConfigToDisk();
                return;
            } else {
                throw new Error(`Failed to read config file.`);
            }
        }
        let parsedConfigContents: AppConfig;

        try {
            parsedConfigContents = JSON.parse(fileContents);
        } catch (_error) {
            throw new Error('Received invalid value from disk. Must be JSON object.');
        }

        this.config = this.validateApplicationConfig(parsedConfigContents);
    }

    private async writeConfigToDisk() {
        await this.fileService.writeFile(this.configPath, jsonToString(this.config));
    }

    private validateApplicationConfig(config: AppConfig): AppConfig {
        try {
            return AppConfigSchema.parse(config);
        } catch (_error) {
            throw new Error(`Received invalid app config from disk.`);
        }
    }
}
