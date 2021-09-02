import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  transform: { "\\.[jt]sx?$": "babel-jest" },
  clearMocks: true,
  collectCoverage: true,
};

export default config;
