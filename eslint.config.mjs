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
    ...tseslint.configs.recommended,

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
                ...globals.jest,
            },
            parserOptions: {
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

            // Custom Rules from legacy config
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            'react/prop-types': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/self-closing-comp': 'error',
            'react/no-array-index-key': 'warn',
            'jsx-a11y/anchor-is-valid': 'off',
            'no-console': 'warn',
            'prefer-const': 'error',
            'no-var': 'error',
            'no-const-assign': 'off', // As per legacy config
        },
    },

    // Test file overrides
    {
        files: ['**/*.test.{js,jsx,ts,tsx}', '**/setupTests.ts'],
        rules: {
            'no-console': 'off',
        },
    }
);
