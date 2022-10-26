module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: 'standard',
    ignorePatterns: '*.cy.js',
    overrides: [
        {
            files: '*.cy.js',
            plugins: [
                'cypress'
            ]
        }
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    rules: {
        eqeqeq: ['error', 'smart'],
        indent: ['error', 4],
        'max-len': ['error', { code: 120 }],
        'require-jsdoc': 0,
        semi: ['error', 'always', { omitLastInOneLineBlock: true }]
    },
    plugins: [
        'html'
    ]
};
