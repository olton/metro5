module.exports = {
    verbose: true,
    modulePaths: ['<rootDir>/src/'],
    collectCoverageFrom: ['<rootDir>/src/**/*.js'],
    testMatch: ['<rootDir>/test/**/*.js'],
    testURL: 'http://localhost',
    testPathIgnorePatterns: ['node_modules'],
    transformIgnorePatterns: [
        '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$'
    ],
    moduleFileExtensions: ['js'],
    coverageThreshold: {
        global: {
            statements: 80,
            branches: 80,
            functions: 80,
            lines: 80
        }
    },
    transform: {
        '^.+\\.js$': 'babel-jest'
    }
};
