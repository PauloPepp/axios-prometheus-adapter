module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'indent': ['error', 2, { 'SwitchCase': 1, 'ignoredNodes': ['PropertyDefinition'] }],
    'complexity': ['error', { max: 7 }],
    'eol-last': 1,
    'comma-dangle': ['error', {
      'objects': 'always-multiline'
    }],
    'quotes': ['error', 'single', {
      "avoidEscape": true,
      "allowTemplateLiterals": true
    }],
    'comma-spacing': ['error', {
      before: false,
      after: true
    }],
    'arrow-spacing': ['error', {
      before: true,
      after: true
    }],
    'func-call-spacing': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'semi-spacing': ['error', {
      before: false,
      after: false
    }],
    'key-spacing': ['error', {}],
    'keyword-spacing': ['error', {
      before: true,
      after: true
    }],
    'switch-colon-spacing': ['error', {
      before: false,
      after: true
    }],
    'space-before-function-paren': ['error', {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always'
    }],
    'space-before-blocks': ['error', {
      'functions': 'always'
    }],
    'template-tag-spacing': ['error', 'always'],
    'block-spacing': ['error', 'always'],
    'max-len': ['error', {
      code: 120,
      ignorePattern: "^import | ^export (.*?)",
      ignoreTemplateLiterals: true
    }],
    'arrow-parens': ['error', 'as-needed'],
    '@typescript-eslint/explicit-member-accessibility': ['error', {
      accessibility: 'no-public'
    }],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/member-delimiter-style': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-parameter-properties': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/array-type': 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/prefer-interface': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        'selector': ['variable', 'function'],
        'format': ['camelCase', 'UPPER_CASE'],
        'leadingUnderscore': 'allow'
      },
      {
        'selector': 'interface',
        'format': ['PascalCase'],
        'custom': {
          'regex': '^[A-Za-z]*$',
          'match': true
        }
      }
    ],
    '@typescript-eslint/indent': ['error', 2, {
      'SwitchCase': 1,
      'ignoredNodes': [
        'PropertyDefinition[decorators]',
        'TSUnionType'
      ]
    }],
  },
};
