module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    testMatch: [
        '<rootDir>/src/**/*.test.{js,jsx,ts,tsx}',
    ],
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/index.tsx',
        '!src/setupTests.ts',
        '!src/**/*.test.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^react-router-dom$': '<rootDir>/node_modules/react-router-dom/dist/index.js',
        '^react-router$': '<rootDir>/node_modules/react-router/dist/development/index.js',
        '^react-router/dom$': '<rootDir>/node_modules/react-router/dist/development/dom-export.js',
    },
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
    testPathIgnorePatterns: [
        '/node_modules/',
        '/build/',
        '/coverage/',
    ],
    transformIgnorePatterns: [
        'node_modules/(?!(.*\\.mjs$))',
    ],
    testEnvironmentOptions: {
        url: 'http://localhost',
        customExportConditions: [''],
    },
    slowTestThreshold: 5,
    testTimeout: 10000,
};
