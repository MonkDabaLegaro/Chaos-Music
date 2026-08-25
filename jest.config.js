/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/packages', '<rootDir>/apps/desktop'],
  testMatch: [
    '**/__tests__/**/*.test.(ts|tsx)',
    '**/?(*.)+(spec|test).(ts|tsx)',
  ],
  moduleNameMapper: {
    '^@chaos-music/contracts$': '<rootDir>/packages/contracts/src/index.ts',
    '^@chaos-music/core$': '<rootDir>/packages/core/src/index.ts',
    '^@chaos-music/adapters-desktop$': '<rootDir>/packages/adapters-desktop/src/index.ts',
    '^@chaos-music/design-system$': '<rootDir>/packages/design-system/src/index.ts',
    '^@chaos-music/ui$': '<rootDir>/packages/ui/src/index.ts',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/', '/release/'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.json',
      diagnostics: true,
    }],
  },
};
