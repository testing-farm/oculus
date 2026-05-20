import neostandard from 'neostandard';
import html from 'eslint-plugin-html';
import globals from 'globals';
import { globalIgnores } from 'eslint/config';

export default [
    globalIgnores(['node_modules/', 'scenarios/', 'cypress/']),

    ...neostandard({ semi: true }),

    {
        languageOptions: {
            globals: globals.browser,
        },
    },

    {
        files: ['**/*.html'],
        plugins: { html },
        settings: {
            'html/indent': '+0',
        },
    },

    {
        rules: {
            eqeqeq: ['error', 'smart'],
            '@stylistic/indent': ['error', 4],
            '@stylistic/max-len': ['error', { code: 120 }],
            '@stylistic/semi': ['error', 'always', { omitLastInOneLineBlock: true }],
        },
    },

    {
        files: ['cypress.config.js'],
        languageOptions: { sourceType: 'commonjs' },
    },
];
