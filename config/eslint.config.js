module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    es6: true,
    node: true
  },
  rules: {
    'react/prop-types': 'off', // Since you're not using PropTypes
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'import/no-unresolved': 'off', // CRA handles this
    'jsx-a11y/anchor-is-valid': 'off', // For react-router Link components
    'react-hooks/exhaustive-deps': 'warn', // Warn about missing dependencies
    'no-unused-vars': 'warn', // Warn about unused variables
    'no-console': 'warn', // Warn about console statements
    'prefer-const': 'error', // Enforce const for variables that aren't reassigned
    'no-var': 'error', // Disallow var declarations
    'no-const-assign': 'off' // Allow reassigning const variables in state management functions
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
