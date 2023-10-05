/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(test).[t]s?(x)"],
  transform: { "^.+\\.(t|j)sx?$": "@swc/jest" },
  setupFilesAfterEnv: ["<rootDir>/jest.integration.setup.js"],
};
