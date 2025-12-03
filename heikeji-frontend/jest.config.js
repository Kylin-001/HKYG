module.exports = {
  moduleFileExtensions: ['js', 'vue'],
  transform: {
    '^.+\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\.(vue)$': '<rootDir>/node_modules/vue-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,vue}', '!src/main.js', '!**/node_modules/**'],
  coverageDirectory: '<rootDir>/tests/unit/coverage',
  testURL: 'http://localhost/',
}
