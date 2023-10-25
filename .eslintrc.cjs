// eslint-disable-next-line no-undef
module.exports = {
    extends: ['eslint:recommended', 'plugin:import/recommended'],
    env: {
        node: true
    },
    parser: '@babel/eslint-parser',
    parserOptions: {
        requireConfigFile: false
    },
    root: true,
    rules: {
        // 'linebreak-style': [
        //     1,
        //     'unix'
        // ],
        'quotes': [
            'warn',
            'single'
        ],
        'semi': [
            1,
            'always'
        ],
        'semi-spacing': 'warn',
        'indent': ['warn', 4],
        'max-len': [1, { 'code': 120 }],
        'no-var': 1,
        'space-in-parens': 'warn',
        'no-multiple-empty-lines': 'warn',
        'no-trailing-spaces': 'warn',
        'prefer-const': 'warn',
        'space-infix-ops': 'warn',
        'space-before-function-paren': [
            'warn', { 'anonymous': 'never',
                'named': 'never',
                'asyncArrow': 'always' }
        ],
        'array-bracket-newline': 'warn',
        'arrow-spacing': ['warn', { 'before': true, 'after': true }],
        'object-curly-newline': ['warn', {
            "ObjectExpression": { "multiline": true, "minProperties": 4 },
            "ObjectPattern": { "multiline": true, "minProperties": 6 },
            "ImportDeclaration": "never",
            "ExportDeclaration": { "multiline": true, "minProperties": 2 }
        }],
        'object-property-newline': ['warn', { 'allowAllPropertiesOnSameLine': true }],
        'comma-dangle': ['warn', 'never'],
        'no-mixed-spaces-and-tabs': 'warn',
        'require-jsdoc': 'off',
        'no-unused-vars': 'warn',
        'no-invalid-this': 'off',
        'object-curly-spacing': ['warn', 'always'],
        'brace-style': ['warn', '1tbs', { 'allowSingleLine': true }],
        'prefer-template': 'warn',
        'operator-assignment': ['warn', 'always'],
        'no-unneeded-ternary': ['warn'],
        'no-lonely-if': 'warn',
        'eol-last': 'warn',
        'comma-spacing': 'warn',
        'comma-style': ['warn', 'last'],
        'computed-property-spacing': ['warn', 'never'],
        'function-paren-newline': [1, 'consistent'],
        'arrow-parens': [1],
        'space-before-blocks': [1, 'always'],
        'padded-blocks': ['warn', 'never'],
        'sort-imports': 'error',
        'sort-keys': 'off',
        'no-restricted-syntax': 'off',
        'no-await-in-loop': 'off',
        'no-shadow': 'off',
        'no-use-before-define': 'off',
        'no-return-await': 'off',
        'no-param-reassign': 'off',
        'no-plusplus': 'off',
        'class-methods-use-this': 'off',
        'no-else-return': 'off',
        'arrow-body-style': 'off',
        'operator-linebreak': ['warn', 'after'],
        'implicit-arrow-linebreak': 'off',
        'quote-props': 'off',
        'max-classes-per-file': 'off',
        'import/no-extraneous-dependencies': 'off',
        'no-underscore-dangle': 'off',
        'guard-for-in': 'off',
        'no-empty-pattern': 'off'
    }
};
