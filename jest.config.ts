import { defaults } from 'jest-config';

const jestConfig = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    "^.+\\.svg$": "<rootDir>/svgTransform.ts"
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: [
    "@testing-library/jest-dom/extend-expect"
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sss|styl)$": "<rootDir>/node_modules/jest-css-modules",
    '^@backend/(.*)$': '<rootDir>/../server/src/api/$1',
  },
};

export default jestConfig;