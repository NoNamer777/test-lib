import { homedir } from 'os';
import { join } from 'path';
import { cwd } from 'process';
import { z } from 'zod';
import { isRunningOnWindows } from '../../utils';

export const AppConfigSchema = z
    .object({
        /** The name of the application */
        appName: z.string().readonly(),

        /** ID of the application. */
        appId: z.string().readonly(),

        /**
         * Path of the directory where application data is kept.
         * Most other paths described below build upon this path, except for the {@link systemDownloadsDirectoryPath}.
         */
        baseAppDataDirectoryPath: z.string().readonly(),

        /** Path of the directory where assets can be found. This includes images/icons, scripts, translation files, etc. */
        assetsDirectoryPath: z.string().readonly(),

        /**
         * Path of the directory where files are temporarily kept.
         * Usually while files are being downloaded they will be kept here and once they're finished downloading they'll
         * be moved to the correct directory.
         */
        tempFilesDirectoryPath: z.string().readonly(),

        /** Path of the directory where files that have been downloaded through the CSDA will be kept. */
        downloadsDirectoryPath: z.string().readonly(),

        /** Path of the directory where the system usually outputs files that are downloaded. */
        systemDownloadsDirectoryPath: z.string().readonly(),

        /** Path of the directory where files will be kept that have been cached. */
        cacheDirectoryPath: z.string().readonly(),

        /** Path of the directory where log files will be stored */
        logsDirectoryPath: z.string().readonly(),

        /** The locale for the translations. */
        locale: z.string(),

        /** The port on which the websocket makes a connection with Studio in a web browser. */
        websocketPort: z.number().int().min(0).max(65535),

        /**
         * A string consisting of a number and letter, symbolizing the amount of storage space is allocated for the cache.
         * The following suffix letters are supported and their meaning is as follows:
         *
         * - `GB`: Gigabytes
         * - `MB`: MegaBytes
         * - `KB`: KiloBytes
         */
        cacheSize: z.string(),

        /**
         * A string consisting of a number and a letter, symbolising the interval in which the cache is cleaned up.
         * The following suffix letters or keywords are supported and their meaning is as follows:
         *
         * - `ms`: milliseconds
         * - `s`: seconds
         * - `d`: days
         * - `m`: months
         * - `y`: years
         *
         * The keyword `never` is also supported to disable automatically cleaning the cache.
         */
        cacheAutoCleanInterval: z.string(),
    })
    .strict()
    .required();

export type AppConfig = z.infer<typeof AppConfigSchema>;

export type AppSetting = keyof AppConfig;

class DefaultConfig implements AppConfig {
    public readonly appName = 'Studio Desktop App';
    public readonly appId = 'studio-desktop-app';

    public readonly baseAppDataDirectoryPath = join(
        `${homedir()}`,
        ...(isRunningOnWindows() ? ['AppData', 'Local'] : ['Library', 'Application Support']),
        this.appId
    );

    public readonly assetsDirectoryPath = join(cwd(), 'lib', 'assets');
    public readonly tempFilesDirectoryPath = join(this.baseAppDataDirectoryPath, 'temp');
    public readonly downloadsDirectoryPath = join(homedir(), 'Documents', this.appId);
    public readonly systemDownloadsDirectoryPath = join(homedir(), 'Downloads');
    public readonly cacheDirectoryPath = join(this.baseAppDataDirectoryPath, 'cache');
    public readonly logsDirectoryPath = join(this.baseAppDataDirectoryPath, 'logs');

    public readonly locale = 'enUS';

    public readonly websocketPort = 5_895;

    public readonly cacheSize = '3GB';
    public readonly cacheAutoCleanInterval = '30d';
}

export const defaultConfig = new DefaultConfig();
