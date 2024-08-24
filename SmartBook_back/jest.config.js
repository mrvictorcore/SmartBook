export default {
    testEnvironment: 'node',
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    setupFilesAfterEnv: ['./jest.setup.js'],
  };
  