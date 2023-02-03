// import {ElectronApplication, Page, PlaywrightTestConfig} from '@playwright/test';

// const { _electron: electron } = require('playwright')
// const { test, expect  } = require('@playwright/test')

// test('launch app', async () => {
//   const electronApp = await electron.launch({ args: ['dist-electron/electron/main/index.js'] })

//   const isPackaged = await electronApp.evaluate(async ({ app }) => {
//     // This runs in Electron's main process, parameter here is always
//     // the result of the require('electron') in the main app script.
//     return app.isPackaged
//   })
//   console.log(isPackaged) // false (because we're in development mode)
//   console.log("TER<efv<awetga<w4erghaywe4tga<w4etg")
//   const window = await electronApp.firstWindow();
//   console.log(await window.title());

//   // close app
//   await electronApp.close()
// })

// test('save screenshot', async () => {
//   const electronApp = await electron.launch({ args: ['dist-electron/electron/main/index.js'] })
//   const window = await electronApp.firstWindow()
//   await window.screenshot({ path: 'intro.png' })
//   // close app
//   await electronApp.close()
// })

// test('save scssreenshot', async () => {
//   const electronApp = await electron.launch({ args: ['dist-electron/electron/main/index.js'] })
//   const windowState = await electronApp.evaluate(async ({ BrowserWindow }) => {
//     const mainWindow = BrowserWindow.getAllWindows()[0];

//     const getState = () => ({
//       isVisible: mainWindow.isVisible(),
//       isDevToolsOpened: mainWindow.webContents.isDevToolsOpened(),
//       isCrashed: mainWindow.webContents.isCrashed(),
//     });

//     return new Promise((resolve) => {
//       if (mainWindow.isVisible()) {
//         resolve(getState());
//       } else {
//         mainWindow.once("ready-to-show", () =>
//           setTimeout(() => resolve(getState()), 0)
//         );
//       }
//     });
//   });
//   // close app
//   await electronApp.close()
// })

// test('example test', async () => {
//   const electronApp = await electron.launch({ args: ['dist-electron/electron/main/index.js'] })
//   const isPackaged = await electronApp.evaluate(async ({ app }) => {
//     // This runs in Electron's main process, parameter here is always
//     // the result of the require('electron') in the main app script.
//     return app.isPackaged;
//   });

//   expect(isPackaged).toBe(false);

//   // Wait for the first BrowserWindow to open
//   // and return its Page object
//   const window = await electronApp.firstWindow()
//   await window.screenshot({ path: 'intro.png' })

//   // close app
//   await electronApp.close()
// });

// test('eine test', async () => {
//   // Launch Electron app.
//   const electronApp = await electron.launch({ args: ['dist-electron/electron/main/index.js'] });

//   // Evaluation expression in the Electron context.
//   const appPath = await electronApp.evaluate(async ({ app }) => {
//     // This runs in the main Electron process, parameter here is always
//     // the result of the require('electron') in the main app script.
//     return app.getAppPath();
//   });
//   console.log(appPath);

//   // Get the first window that the app opens, wait if necessary.
//   const window = await electronApp.firstWindow();
//   // Print the title.
//   console.log(await window.title());
//   // Capture a screenshot.
//   await window.screenshot({ path: 'intro.png' });
//   // Direct Electron console to Node terminal.
//   window.on('console', console.log);
//   // Click button.
//   await window.click('text=Click me');
//   // Exit app.
//   await electronApp.close();
// });

// describe('Electron App', () => {
//   let browser: any;
//   let context: any;
//   let page: any;

//   beforeEach(async () => {
//     browser = await electron.launch({ args: ['dist-electron/electron/main/index.js'] })
//     context = await browser.newContext();
//     page = await context.newPage();
//   });

//   afterEach(async () => {
//     await browser.close();
//   });

//   it('should open the electron app', async () => {
//     await page.goto('http://localhost:3000');
//     expect(await page.title()).toEqual('Electron App');
//   });
// });

// test("Launch electron app", async () => {
//   const electronApp = await electron.launch({ args: ["."] });

//   const windowState: {
//     isVisible: boolean;
//     isDevToolsOpened: boolean;
//     isCrashed: boolean;
//   } = await electronApp.evaluate(async ({ BrowserWindow }) => {
//     const mainWindow = BrowserWindow.getAllWindows()[0];

//     const getState = () => ({
//       isVisible: mainWindow.isVisible(),
//       isDevToolsOpened: mainWindow.webContents.isDevToolsOpened(),
//       isCrashed: mainWindow.webContents.isCrashed(),
//     });

//     return new Promise((resolve) => {
//       if (mainWindow.isVisible()) {
//         resolve(getState());
//       } else {
//         mainWindow.once("ready-to-show", () =>
//           setTimeout(() => resolve(getState()), 0)
//         );
//       }
//     });
//   });

//   expect(windowState.isVisible).toBeTruthy();
//   expect(windowState.isDevToolsOpened).toBeFalsy();
//   expect(windowState.isCrashed).toBeFalsy();

//   await electronApp.close();
// });

// test.describe("Check Man Page", async () => {
//   let electronApp: ElectronApplication;
//   let window: Page;

//   // Set up the test before each test execution
//   test.beforeAll(async () => {
//     electronApp = await electron.launch({ args: ['dist-electron/electron/main/index.js']});
//     window = await electronApp.firstWindow();
//   });

//   test('Check Title', async() => {
//     console.log("asdf");
//     const title = await window.title();
//     expect(title).toBe("Project Canvas");
//     console.log("The name of the title of the first window: " + title)
//     console.log("asdf");
//   })

//   test('launch app', async () => {

//     const isPackaged = await electronApp.evaluate(async ({ app }) => {
//       // This runs in Electron's main process, parameter here is always
//       // the result of the require('electron') in the main app script.
//       return app.isPackaged
//     })
//     console.log(isPackaged) // false (because we're in development mode)
//     console.log("TER<efv<awetga<w4erghaywe4tga<w4etg")
//     console.log(await window.title());

//     await window.click('text=Click me');

//   })

//   // close the electron app after each test
//   test.afterAll(async () => {
//     await electronApp.close();
//   });
// });
