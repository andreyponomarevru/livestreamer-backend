/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      tsconfig: {
        rootDir: ".",
      },
    },
  },
  // Extends Jest with assertions from jest-extended
  setupFilesAfterEnv: ["jest-extended/all"],
};
