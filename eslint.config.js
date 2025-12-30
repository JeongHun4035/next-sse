import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import importPlugin from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import nextPlugin from '@next/eslint-plugin-next'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  // ✅ ignore
  {
    ignores: [
      '.next/**',
      'dist/**',
      'node_modules/**',
      'out/**',
      'coverage/**',
      'eslint.config.js',
    ],
  },

  // ✅ JS + TS 기본 추천
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // ✅ Next + React + Stylistic 통합
  {
    plugins: {
      '@stylistic': stylistic,
      import: importPlugin,
      'unused-imports': unusedImports,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      next: nextPlugin,
      '@typescript-eslint': tseslint.plugin,
    },

    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    rules: {
      // ✅ Next 핵심 룰
      'next/no-img-element': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // ✅ React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/jsx-indent': ['error', 2],
      '@stylistic/jsx-curly-spacing': ['error', { when: 'never', children: true }],
      '@stylistic/jsx-one-expression-per-line': ['error', { allow: 'single-child' }],

      // ✅ unused-imports
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // ✅ import 정렬
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'type',
          ],
          'newlines-between': 'always',
        },
      ],

      // ✅ Next App Router에 맞게 React import 관련 룰 OFF
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    },
  },
]
