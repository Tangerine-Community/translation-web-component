import { playwrightLauncher } from "@web/test-runner-playwright";

export default {
  files: "test/**/*.test.js", // We will name our new tests .test.js
  nodeResolve: true,
  browsers: [playwrightLauncher({ product: "chromium" })],
  testFramework: {
    config: {
      ui: "bdd",
      timeout: "2000",
    },
  },
};
