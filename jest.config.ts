import { Config } from 'jest';

const jestConfig: Config = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: '<rootDir>/coverage/test',
    coveragePathIgnorePatterns: ['node_modules', 'testing/*', 'index.ts', 'public-api.ts'],
    coverageReporters: ['html', 'text-summary'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    displayName: 'Test',
    maxConcurrency: 1,
    maxWorkers: 1,
    moduleFileExtensions: ['ts', 'js'],
    moduleNameMapper: {
        '@/testing': '<rootDir>/lib/src/testing/public-api.ts',
    },
    passWithNoTests: true,
    randomize: true,
    reporters: ['default'],
    rootDir: '.',
    setupFilesAfterEnv: ['<rootDir>/lib/src/test.ts'],
    showSeed: true,
    testEnvironment: 'node',
    testRegex: '.*.spec.ts$',
};

export default jestConfig;
