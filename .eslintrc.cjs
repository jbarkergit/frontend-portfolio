/** @type {import("eslint").Linter.Config} */

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'react/react-in-jsx-scope': 'on',
    'prettier/prettier': ['error'],
    'object-property-newline': ['error', { allowMultiplePropertiesPerLine: false }],
    'array-element-newline': ['error', 'always'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
