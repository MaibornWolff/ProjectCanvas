How to use Playwright

Playwright currently only has experimental support for Electron automation.
Some features may not work.

Documentation of Playwright
Electron: https://playwright.dev/docs/api/class-electron
ElectronApplication: https://playwright.dev/docs/api/class-electronapplication

We are using three packages:

1. "@playwright/test": "^1.30.0" -> We need this to be able to test the electron app
2. "playwright": "^1.30.0" -> This is the standard Playwright package
3. "electron-playwright-helpers": "^1.5.1" -> This is a custom package which helps us find the path to the Executable
      (In the future, we need to decide if there is still the need for this package. If we find another way to find the Path of the executable, this can be deleted)

Before the tests can be executed, the executable needs to be created.

1. yarn install (check if everything is up-to-date)
2. yarn canvas:build (build the executable)

The tests can be executed with the following command:

yarn playwright test

I added this to the Script part of the package.json, so we can run the test using the following command:

yarn test

The structure of the Tests:

1. The imports:
   import { expect, test } from "@playwright/test"
   import { findLatestBuild, parseElectronApp } from "electron-playwright-helpers"
   import { ElectronApplication, Page, \_electron as electron } from "playwright"

2. We are using a test.describe block
   Here we have three parts:
       1. test.beforeEach
       Here we set up the Tests.
       The Application is build using the findLatestBuild method
       (This is a method from the electron-playwright-helpers package)
       2. test()
       Here we write our tests.
       3. test.afterEach
       Here we close the Application.

Mocking

For the Mocking of the Jira Server, we are using the page.route listener.
Here, we can create a listener that returns a defined JSON Object when the specified URL is called.
