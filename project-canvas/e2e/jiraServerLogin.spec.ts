import { _electron as electron, test } from "@playwright/test"

test.describe("Login", () => {
  test("Log in with Jira Server", async () => {
    const app = await electron.launch({ args: [".", "--no-sandbox"] })
    const page = await app.firstWindow()

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
      await route.fulfill({ body: JSON.stringify(json) })
    })

    await page.route(
      "http://localhost:9090/boardIdsByProject?project=TEST",
      async (route) => {
        const json = [1]
        await route.fulfill({ json })
      }
    )

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

    await page.route(
      "http://localhost:9090/issuesBySprintAndProject?sprint=1&project=TEST&boardId=1",
      async (route) => {
        const json = [
          {
            issueKey: "TEST-10",
            summary: "Summary",
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
            summary: "Summary",
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
            summary: "Summary",
            creator: "admin",
            status: "In Arbeit",
            type: "Sub-Task",
            labels: [],
            assignee: {},
            rank: "0|i0002f:",
          },
          {
            issueKey: "TEST-13",
            summary: "Summary",
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

    await page.route(
      "http://localhost:9090/issuesBySprintAndProject?sprint=3&project=TEST&boardId=1",
      async (route) => {
        const json = [""]
        await route.fulfill({ json })
      }
    )

    await page.route(
      "http://localhost:9090/backlogIssuesByProjectAndBoard?project=TEST&boardId=1",
      async (route) => {
        const json = [
          {
            issueKey: "TEST-4",
            summary: "Summary",
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
            summary: "Summary",
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

    await page.click("text=Jira Server")

    await page.getByLabel("Instance URL").fill("http://localhost:8080")
    await page.getByLabel("Username").fill("admin")
    await page.getByLabel("Password").fill("admin")

    await page.route("http://localhost:9090/login", async (route) => {
      await route.fulfill({ status: 200 })
    })

    await page.click("text=Log in", { delay: 500 })
    await page.click("text=Backlog", { delay: 500 })

    await app.close()
  })
})
