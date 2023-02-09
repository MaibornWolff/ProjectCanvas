import { expect, test } from "@playwright/test"

import { findLatestBuild, parseElectronApp } from "electron-playwright-helpers"
import { ElectronApplication, Page, _electron as electron } from "playwright"

test.describe("Check Man Page", async () => {
  let electronApp: ElectronApplication
  let page: Page

  // Set up the test before each test execution
  test.beforeEach(async () => {
    const latestBuild = findLatestBuild("release/1.0.0")
    const appInfo = parseElectronApp(latestBuild)
    electronApp = await electron.launch({
      args: [appInfo.main],
      executablePath: appInfo.executable,
    })
    let windowText
    while (!windowText) {
      // eslint-disable-next-line no-await-in-loop
      page = await electronApp.firstWindow()
      // eslint-disable-next-line no-await-in-loop
      windowText = await page.title()
    }
  })

  test("Test Project Canvas Login, ProjectView and Backlogview", async () => {
    // Create listener that mocks the Login to the server and retuns a status that indicates a successfull login
    await page.route("http://localhost:9090/login", async (route) => {
      const json = {
        message: "Successful login",
      }
      await route.fulfill({ json })
    })

    // Create listener that mocks GetProjects and returns a test project
    await page.route("http://localhost:9090/projects", async (route) => {
      const json = [
        {
          key: "TEST",
          name: "test",
          id: "10000",
          lead: "admin@admin.de",
          type: "software",
        },
      ]
      await route.fulfill({ json })
    })

    // Create listener that mocks GetProjects and returns a test project
    await page.route(
      "http://localhost:9090/boardIdsByProject?project=TEST",
      async (route) => {
        const json = [1]
        await route.fulfill({ json })
      }
    )

    // Create listener
    await page.route(
      "http://localhost:9090/sprintsByBoardId?boardId=1",
      async (route) => {
        const json = [
          {
            id: 1,
            name: "Sample Sprint 2",
            state: "active",
            startDate: "01/16/2023, 12:31",
            endDate: "01/30/2023, 12:51",
          },
          {
            id: 3,
            name: "Sample Sprint 3",
            state: "future",
            startDate: "Invalid Date",
            endDate: "Invalid Date",
          },
        ]
        await route.fulfill({ json })
      }
    )

    // Create listener
    await page.route(
      "http://localhost:9090/issuesBySprintAndProject?sprint=1&project=TEST&boardId=1",
      async (route) => {
        const json = [
          {
            issueKey: "TEST-10",
            summary:
              "As a developer, I can update story and task status with drag and drop",
            creator: "admin",
            status: "In Arbeit",
            type: "Story",
            storyPointsEstimate: 5,
            labels: [],
            assignee: {
              displayName: "admin@admin.de",
              avatarUrls: {
                "48x48":
                  "https://www.gravatar.com/avatar/4737ec7a20fb695e533a688ac580f5f1?d=mm&s=48",
                "24x24":
                  "https://www.gravatar.com/avatar/4737ec7a20fb695e533a688ac580f5f1?d=mm&s=24",
                "16x16":
                  "https://www.gravatar.com/avatar/4737ec7a20fb695e533a688ac580f5f1?d=mm&s=16",
                "32x32":
                  "https://www.gravatar.com/avatar/4737ec7a20fb695e533a688ac580f5f1?d=mm&s=32",
              },
            },
            rank: "0|i0001z:",
          },
          {
            issueKey: "TEST-11",
            summary:
              'Update task status by dragging and dropping from column to column >> Try dragging this task to "Done"',
            creator: "admin",
            status: "In Arbeit",
            type: "Sub-Task",
            labels: [],
            assignee: {
              displayName: "admin@admin.de",
              avatarUrls: {
                "48x48":
                  "https://www.gravatar.com/avatar/4737ec7a20fb695e533a688ac580f5f1?d=mm&s=48",
                "24x24":
                  "https://www.gravatar.com/avatar/4737ec7a20fb695e533a688ac580f5f1?d=mm&s=24",
                "16x16":
                  "https://www.gravatar.com/avatar/4737ec7a20fb695e533a688ac580f5f1?d=mm&s=16",
                "32x32":
                  "https://www.gravatar.com/avatar/4737ec7a20fb695e533a688ac580f5f1?d=mm&s=32",
              },
            },
            rank: "0|i00027:",
          },
          {
            issueKey: "TEST-12",
            summary:
              'When the last task is done, the story can be automatically closed >> Drag this task to "Done" too',
            creator: "admin",
            status: "In Arbeit",
            type: "Sub-Task",
            labels: [],
            assignee: {},
            rank: "0|i0002f:",
          },
          {
            issueKey: "TEST-13",
            summary:
              'As a developer, I can update details on an item using the Detail View >> Click the "TEST-13" link at the top of this card to open the detail view',
            creator: "admin",
            status: "Zu erledigen",
            type: "Bug",
            labels: [],
            assignee: {
              displayName: "admin@admin.de",
              avatarUrls: {
                "48x48":
                  "https://www.gravatar.com/avatar/4737ec7a20fb695e533a688ac580f5f1?d=mm&s=48",
                "24x24":
                  "https://www.gravatar.com/avatar/4737ec7a20fb695e533a688ac580f5f1?d=mm&s=24",
                "16x16":
                  "https://www.gravatar.com/avatar/4737ec7a20fb695e533a688ac580f5f1?d=mm&s=16",
                "32x32":
                  "https://www.gravatar.com/avatar/4737ec7a20fb695e533a688ac580f5f1?d=mm&s=32",
              },
            },
            rank: "0|i0002n:",
          },
        ]
        await route.fulfill({ json })
      }
    )

    // Create listener
    await page.route(
      "ttp://localhost:9090/issuesBySprintAndProject?sprint=3&project=TEST&boardId=1",
      async (route) => {
        const json = [""]
        await route.fulfill({ json })
      }
    )

    // Create listener
    await page.route(
      "http://localhost:9090/backlogIssuesByProjectAndBoard?project=TEST&boardId=1",
      async (route) => {
        const json = [
          {
            issueKey: "TEST-4",
            summary:
              'As a team, I\'d like to estimate the effort of a story in Story Points so we can understand the work remaining >> Try setting the Story Points for this story in the "Estimate" field',
            creator: "admin",
            status: "Zu erledigen",
            type: "Story",
            storyPointsEstimate: 5,
            labels: [],
            assignee: {},
            rank: "0|i0000c:",
          },
          {
            issueKey: "TEST-3",
            summary:
              "As a product owner, I'd like to rank stories in the backlog so I can communicate the proposed implementation order >> Try dragging this story up above the previous story",
            creator: "admin",
            status: "Zu erledigen",
            type: "Bug",
            labels: [],
            assignee: {},
            rank: "0|i0000n:",
          },
        ]
        await route.fulfill({ json })
      }
    )

    const title = await page.title()
    expect(title).toBe("Project Canvas")

    await page.click("text=Jira Server")

    await page.getByLabel("Instance URL").fill("http://localhost:8080")
    await page.getByLabel("Username").fill("admin")
    await page.getByLabel("Password").fill("admin")

    await page.click("text=Log in", { delay: 500 })
    await page.click("text=Backlog", { delay: 500 })
  })

  test("Test Login Jira Cloud", async () => {
    const title = await page.title()
    expect(title).toBe("Project Canvas")

    await page.click("text=Jira Cloud", { delay: 500 })

    page.on("popup", async (popup) => {
      expect(popup.title()).toBe("Authorize App")
      await popup.close()
    })
  })

  // close the electron app after each test
  test.afterEach(async () => {
    await electronApp.close()
  })
})
