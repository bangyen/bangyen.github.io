module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    },
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-env', '@babel/preset-react']
    }
  },
  plugins: ['@typescript-eslint'],
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react/prop-types': 'off', // Since you're not using PropTypes
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/self-closing-comp': 'error', // Enforce self-closing tags
    'react/no-array-index-key': 'warn', // Warn about using array indices as keys
    'import/no-unresolved': 'off', // CRA handles this
    'jsx-a11y/anchor-is-valid': 'off', // For react-router Link components
    'no-unused-vars': 'off', // Use TypeScript version instead
    'no-console': 'warn', // Warn about console statements
    'prefer-const': 'error', // Enforce const for variables that aren't reassigned
    'no-var': 'error', // Disallow var declarations
    'no-const-assign': 'off' // Allow reassigning const variables in state management functions
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.test.jsx', '**/*.test.ts', '**/*.test.tsx', '**/setupTests.js'],
      rules: {
        'no-console': 'off' // Allow console statements in test files
      }
    }
  ],
  settings: {
    react: {
      version: 'detect'
    }
  }
};
