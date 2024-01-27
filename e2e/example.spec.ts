import { ElectronApplication, _electron as electron, expect, test } from "@playwright/test";

import { findLatestBuild, parseElectronApp } from "electron-playwright-helpers";

let electronApp: ElectronApplication;

test.beforeAll(async () => {
  const latestBuild = findLatestBuild();
  const appInfo = parseElectronApp(latestBuild);
  electronApp = await electron.launch({
    args: [appInfo.main],
    executablePath: appInfo.executable,
  });
});

test.afterAll(async () => {
  await electronApp.close();
});

test("homepage has title and links to intro page", async () => {
  const page = await electronApp.firstWindow();
  await page.screenshot({ path: "e2e/screenshots/example.png" });
  expect(await page.title()).toBe("Project Canvas");
});
