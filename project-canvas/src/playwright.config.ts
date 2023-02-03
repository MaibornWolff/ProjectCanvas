import { PlaywrightTestConfig } from "@playwright/test"

const config: PlaywrightTestConfig = {
  testDir: "./tests",
  timeout: 6000000,
  maxFailures: 2,
  // webServer: {
  //   command: "yarn canvas",
  //   port: 5173,
  // },
}

// eslint-disable-next-line import/no-default-export
export default config
