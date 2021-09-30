import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  transform: { "\\.[jt]sx?$": "babel-jest" },
  transformIgnorePatterns: [".*eeGeoWebGL.*"],
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["./src/**"],
  coveragePathIgnorePatterns: [".d.ts"],
};

export default config;
