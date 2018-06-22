const config = {
  rootDir: process.cwd(),
  testMatch: [`**/__tests__/**/*.js`],
  testPathIgnorePatterns: [
    // ignore files that are under a directory starting with "_" at the root of __tests__
    '/__tests__\\/_.*?',
    // ignore files under __tests__ that start with an "_"
    '/__tests__\\/.*?\\/_.*?',
  ],
  modulePathIgnorePatterns: ['./node_modules'],
  transformIgnorePatterns: ['\\/node_modules\\/(?!@space-miner)'],
  resolver: require.resolve('./src/resolver.js'),
  // transform: {
  //   '^.+\\.js?$': require.resolve('./src/transformer.js'),
  // },
  moduleFileExtensions: ['js'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/build/jest/src/fileMock.js',
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFiles: [require.resolve('./src/setupFile.js')],
};

module.exports = config;
