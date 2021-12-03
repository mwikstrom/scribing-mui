const config = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    testRegex: "test/.*\\.spec\\.tsx?$",
    collectCoverage: true,
    coverageDirectory: "coverage",
    collectCoverageFrom: [
        "src/**/*.ts",
        "src/**/*.tsx",
    ],
};

module.exports = config;
