import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

export default [
    js.configs.recommended,
    ...tsEslint.configs.recommended,
    prettier,
    {
        ignores: ['node_modules/*', 'dist/*', 'coverage/*'],
    },
    {
        files: ["**/*.ts"],
        languageOptions: {
            globals: {
                ...globals.node
            }
        },
        rules: {
            '@typescript-eslint/no-unused-vars': 'off',
        }
    },
    {
        files: ["**/*.js", "**/*.spec.ts"],
        languageOptions: {
            globals: {
                ...globals.jest,
                ...globals.commonjs,
            }
        },
        rules: {
            '@typescript-eslint/ no-require-imports': 'off'
        }
    }
];
