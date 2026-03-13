const expo = require('eslint-config-expo/flat');
const reactNative = require('eslint-plugin-react-native');
const localRules = require('eslint-plugin-local-rules');
const tanstackQuery = require('@tanstack/eslint-plugin-query');
const prettier = require('eslint-config-prettier');

module.exports = [
  ...expo,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react-native': reactNative,
      '@tanstack/query': tanstackQuery,
      'local-rules': localRules,
    },
    rules: {
      // General rules
      'no-console': ['error', { allow: ['error', 'warn'] }],

      // React Native rules
      'react-native/no-inline-styles': 'error',

      // React rules
      'react/jsx-no-bind': [
        'error',
        {
          ignoreDOMComponents: true,
          ignoreRefs: true,
          allowArrowFunctions: true,
          allowFunctions: false,
        },
      ],

      // Restrict imports
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-native',
              importNames: ['Alert', 'KeyboardAvoidingView'],
              message:
                'Do NOT use React Native Alert or KeyboardAvoidingView. Please use our custom Modal/Toast components and react-native-keyboard-controller instead.',
            },
          ],
        },
      ],

      // Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Tanstack Query rules
      ...tanstackQuery.configs.recommended.rules,

      // Local custom rules
      'local-rules/no-inline-api-in-react-query': 'error',
      'local-rules/prefer-flatlist-over-map': 'warn',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    files: ['*Service.ts', '*service.ts', 'src/**/services/**/*.ts'],
    rules: {
      'local-rules/require-try-catch-in-services': 'error',
    },
  },
  prettier,
  {
    ignores: ['node_modules/', '.expo/', 'android/', 'ios/', 'dist/', 'pnpm-lock.yaml'],
  },
];
