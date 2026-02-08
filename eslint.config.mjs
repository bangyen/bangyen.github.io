import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';

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
            'jsx-a11y': jsxA11yPlugin,
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
            // React Recommended Rules (manually applied as some plugins don't fully support flat config spread yet)
            ...reactPlugin.configs.recommended.rules,
            ...reactHooksPlugin.configs.recommended.rules,
            ...jsxA11yPlugin.configs.recommended.rules,

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
            // Disable noisy type-checked rules for migration


            'react/prop-types': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/self-closing-comp': 'error',
            'react/no-array-index-key': 'error',
            'jsx-a11y/anchor-is-valid': 'off',
            'no-console': 'error',
            'prefer-const': 'error',
            'no-var': 'error',
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
        },
    },

    // Script overrides
    {
        files: ['**/scripts/*.ts'],
        rules: {
            'no-console': 'off',
            '@typescript-eslint/restrict-template-expressions': 'off',
        },
    },

    // Research file overrides
    {
        files: ['**/Oligopoly.tsx', '**/VerificationTools.tsx'],
        rules: {
            'no-console': 'off',
        },
    },
);
