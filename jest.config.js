module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    testMatch: [
        '<rootDir>/tests/**/*.test.js',
        '<rootDir>/tests/**/*.test.jsx',
        '<rootDir>/src/**/*.test.js',
        '<rootDir>/src/**/*.test.jsx'
    ],
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/index.js',
        '!src/setupTests.js',
        '!src/**/*.test.{js,jsx}'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest'
    },
    moduleFileExtensions: ['js', 'jsx', 'json'],
    testPathIgnorePatterns: [
        '/node_modules/',
        '/build/',
        '/coverage/'
    ],
    testEnvironmentOptions: {
        url: 'http://localhost'
    }
};
