export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src'],
  transformIgnorePatterns: ['/node_modules'],
  extensionsToTreatAsEsm: ['.ts'],  // 追加
  moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1', // 追加
  },
  transform: {
      '^.+\\.tsx?$': [
          'ts-jest',
          {
              useESM: true,  // 追加
          },
      ],
  },
};