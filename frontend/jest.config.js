const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Caminho para o seu app Next.js
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
};

module.exports = createJestConfig(customJestConfig);
