// jest.config.ts
import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  //transform: {},
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/clarigen/'],
  moduleNameMapper: {
    '^@contracts/(.*)$': '<rootDir>/src/utils/clarigen/$1',
    '^@contracts$': '<rootDir>/src/utils/clarigen/index',
  },
};
export default config;

// Or async function
// export default async (): Promise<Config.InitialOptions> => {
//   return {
//     verbose: true,
//   };
// };
//
// module.exports = {
//   preset: "ts-jest",
//   setupFilesAfterEnv: ["./jest.setup.ts"],
//   //transform: {},
//   testEnvironment: "node",
//   roots: ['<rootDir>/', '<rootDir>/tests/', '<rootDir>/contracts/'],
//   moduleNameMapper: {
//     "^@components/(.*)$": "<rootDir>/components/$1",
//     "^@contracts/(.*)$": "<rootDir>/utils/clarigen/$1",
//     '^@contracts$': '<rootDir>/utils/clarigen/index',
//   },
// };
// https://www.kyrelldixon.com/blog/setup-jest-and-react-testing-library-with-nextjs
