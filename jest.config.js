export default {
    testEnvironment: 'node',
    testMatch: ['**/tests/unit/**/*.test.js'],
    moduleFileExtensions: ['js', 'json', 'node'],
    transform: {},
    transformIgnorePatterns: [
        'node_modules/(?!(mongodb-memory-server|@babel/runtime/helpers/esm)/)'
    ],
    setupFilesAfterEnv: ['./tests/setup.js'],
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    testRunner: 'jest-jasmine2',
    verbose: true
};
