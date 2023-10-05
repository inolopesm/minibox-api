/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec).[t]s?(x)"],
  transform: { "^.+\\.(t|j)sx?$": "@swc/jest" },
};
