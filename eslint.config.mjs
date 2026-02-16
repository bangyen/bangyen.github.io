import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import unicornPlugin from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/* eslint-disable @typescript-eslint/no-deprecated, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
export default tseslint.config(
    { ignores: ['build/**', 'node_modules/**', 'coverage/**', 'config/**', 'dist/**', 'public/**'] },

    // Base configuration
    js.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,

    // React configuration
    {
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            'react-refresh': reactRefreshPlugin,
            'jsx-a11y': jsxA11yPlugin,
            import: importPlugin,
            unicorn: unicornPlugin,
        },
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
                vi: 'readonly',
                vitest: 'readonly',
                describe: 'readonly',
                it: 'readonly',
                test: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
            },
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            // React Recommended Rules
            ...reactPlugin.configs.recommended.rules,
            ...reactHooksPlugin.configs.recommended.rules,
            ...jsxA11yPlugin.configs.recommended.rules,
            ...unicornPlugin.configs.recommended.rules,

            // Import rules
            'import/order': [
                'error',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        ['parent', 'sibling'],
                        'index',
                        'object',
                    ],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
            'import/no-duplicates': 'error',
            'import/no-unresolved': 'off', // TypeScript handles this

            // Custom Rules
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/no-import-type-side-effects': 'error',
            '@typescript-eslint/no-unnecessary-type-conversion': 'off',
            '@typescript-eslint/prefer-nullish-coalescing': 'off',

            'react/prop-types': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/self-closing-comp': 'error',
            'react/no-array-index-key': 'error',
            'react/jsx-no-useless-fragment': 'error',
            'react/jsx-curly-brace-presence': [
                'error',
                { props: 'never', children: 'never' },
            ],
            'react/jsx-pascal-case': 'error',
            'react/no-unstable-nested-components': 'error',
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'jsx-a11y/anchor-is-valid': 'off',
            'no-console': 'error',
            'prefer-const': 'error',
            'no-var': 'error',

            // Unicorn rules overrides
            'unicorn/filename-case': 'off', // Project uses mixed casing
            'unicorn/prevent-abbreviations': 'off', // Too noisy for this project
            'unicorn/no-null': 'off', // React uses null frequently
            'unicorn/prefer-module': 'off', // Mixed usage
            'unicorn/prefer-set-has': 'error',
            'unicorn/no-array-reduce': 'off',
            'unicorn/no-array-callback-reference': 'off',
            'unicorn/consistent-function-scoping': 'off',
            'unicorn/no-new-array': 'off', // new Array(n) is often intended
            'unicorn/prefer-code-point': 'off', // charCodeAt is often preferred for simple ASCII
            'unicorn/text-encoding-identifier-case': 'off', // utf-8 vs utf8 is minor
            'unicorn/prefer-spread': 'off', // split('') is often clearer
            'unicorn/no-array-for-each': 'off', // forEach is standard
            'unicorn/no-empty-file': 'off', // Placeholders are fine
            'unicorn/prefer-add-event-listener': 'off', // onmessage is standard in workers
            'unicorn/prefer-query-selector': 'off',
            'unicorn/prefer-dom-node-dataset': 'off',
            'unicorn/no-nested-ternary': 'off',
            'unicorn/prefer-number-properties': 'off',
            'unicorn/number-literal-case': 'off',
        },
    },

    // Test file overrides
    {
        files: ['**/*.test.{js,jsx,ts,tsx}', '**/setupTests.ts'],
        rules: {
            'no-console': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/unbound-method': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-misused-spread': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/no-useless-constructor': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            'unicorn/no-useless-undefined': 'off',
        },
    },

    // Script overrides
    {
        files: ['**/scripts/*.ts', 'src/features/games/lights-out/scripts/*.ts'],
        rules: {
            'no-console': 'off',
            '@typescript-eslint/restrict-template-expressions': 'off',
            '@typescript-eslint/no-unnecessary-condition': 'off',
            'unicorn/no-process-exit': 'off',
        },
    },

    // Research and Game component overrides
    {
        files: [
            '**/Oligopoly.tsx',
            '**/ZSharp.tsx',
            'src/features/research/components/*.tsx',
            'src/features/games/components/GameErrorBoundary.tsx',
        ],
        rules: {
            'no-console': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            'react/no-unstable-nested-components': 'off',
            '@typescript-eslint/no-empty-function': 'off',
        },
    },

    // Utility and Renderer file overrides
    {
        files: [
            '**/test-utils.tsx',
            'src/utils/math/**/*.ts',
            'src/hooks/useTheme.tsx',
            'src/index.tsx',
            'src/features/games/lights-out/utils/renderers.tsx',
            'src/features/games/lights-out/components/Content.tsx',
        ],
        rules: {
            'react-refresh/only-export-components': 'off',
            '@typescript-eslint/no-misused-spread': 'off',
            '@typescript-eslint/no-unnecessary-condition': 'off',
            '@typescript-eslint/no-empty-function': 'off',
        },
    },
);
