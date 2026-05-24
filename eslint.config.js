const neostandard = require('neostandard');
const html = require('eslint-plugin-html');
const globals = require('globals');

module.exports = [
    { ignores: ['node_modules/', 'scenarios/', 'cypress/'] },

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
