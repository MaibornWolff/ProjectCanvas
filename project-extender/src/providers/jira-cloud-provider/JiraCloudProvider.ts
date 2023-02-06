/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import fetch from "cross-fetch"
import { ProviderApi, ProviderCreator } from "../base-provider"
import {
  Issue,
  Sprint,
  Project,
  dateTimeFormat,
  IssueType,
  User,
} from "../../types"
import {
  JiraIssue,
  JiraIssueType,
  JiraProject,
  JiraSprint,
} from "../../types/jira"
import { getAccessToken } from "./getAccessToken"

class JiraCloudProvider implements ProviderApi {
  public accessToken: string | undefined

  private cloudID = ""

  private customFields = new Map<string, string>()

  async login({
    oauthLoginOptions,
  }: {
    oauthLoginOptions: {
      clientId: string
      clientSecret: string
      redirectUri: string
      code: string
    }
  }) {
    if (this.accessToken === undefined)
      this.accessToken = await getAccessToken(oauthLoginOptions)
    await fetch("https://api.atlassian.com/oauth/token/accessible-resources", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
    }).then(async (response) => {
      await response.json().then(async (domainData) => {
        // TODO: there could be more than just a single domain accessible.
        // Possible solution: add a screen after the login for jira cloud,
        //                    where the user can choose the domain to work on
        this.cloudID = domainData[0].id
      })
    })
    await this.mapCustomFields()
    return this.isLoggedIn()
  }

  async isLoggedIn() {
    return new Promise<void>((resolve, reject) => {
      if (this.accessToken !== undefined) {
        resolve()
      } else {
        reject()
      }
    })
  }

  logout(): Promise<void> {
    return new Promise((resolve) => {
      this.accessToken = undefined
      resolve()
    })
  }

  async mapCustomFields(): Promise<void> {
    const response = await fetch(
      `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/field`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    )
    const data = await response.json()
    data.forEach((field: { name: string; id: string }) => {
      this.customFields.set(field.name, field.id)
    })
  }

  async getProjects(): Promise<Project[]> {
    const response = await fetch(
      `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/project/search?expand=description,lead,issueTypes,url,projectKeys,permissions,insight`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    )
    const data = await response.json()
    const projects = data.values.map((project: JiraProject) => ({
      key: project.key,
      name: project.name,
      id: project.id,
      lead: project.lead.displayName,
      type: project.projectTypeKey,
    }))

    return projects
  }

  async getIssueTypesByProject(projectIdOrKey: string): Promise<IssueType[]> {
    return new Promise((resolve, reject) => {
      fetch(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/2/project/${projectIdOrKey}/statuses`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )
        .then(async (response) => {
          const issueTypes: JiraIssueType[] = await response.json()
          resolve(issueTypes as IssueType[])
        })
        .catch((error) =>
          reject(new Error(`Error in fetching the issue types: ${error}`))
        )
    })
  }

  async getAssignableUsersByProject(projectIdOrKey: string): Promise<User[]> {
    return new Promise((resolve, reject) => {
      fetch(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/user/assignable/search?project=${projectIdOrKey}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )
        .then(async (response) => {
          const users: User[] = await response.json()
          resolve(users as User[])
        })
        .catch((error) =>
          reject(
            new Error(
              `Error in fetching the assignable users for the project ${projectIdOrKey}: ${error}`
            )
          )
        )
    })
  }

  async getBoardIds(project: string): Promise<number[]> {
    const response = await fetch(
      `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/agile/1.0/board?projectKeyOrId=${project}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    )

    const data = await response.json()

    const boardIds: number[] = data.values.map(
      (element: { id: number; name: string }) => element.id
    )
    return boardIds
  }

  async getSprints(boardId: number): Promise<Sprint[]> {
    const response = await fetch(
      `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/agile/1.0/board/${boardId}/sprint`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    )

    const data = await response.json()

    const sprints: Sprint[] = data.values
      .filter((element: { state: string }) => element.state !== "closed")
      .map((element: JiraSprint) => {
        const sDate = new Date(element.startDate)
        const startDate = Number.isNaN(sDate.getTime())
          ? "Invalid Date"
          : dateTimeFormat.format(sDate)
        const eDate = new Date(element.endDate)
        const endDate = Number.isNaN(eDate.getTime())
          ? "Invalid Date"
          : dateTimeFormat.format(eDate)
        return {
          id: element.id,
          name: element.name,
          state: element.state,
          startDate,
          endDate,
        }
      })
    return sprints
  }

  async getIssuesByProject(project: string): Promise<Issue[]> {
    const response = await this.fetchIssues(
      `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/search?jql=project=${project}&maxResults=10000`
    )
    return response
  }

  async getIssuesBySprintAndProject(
    sprintId: number,
    project: string
  ): Promise<Issue[]> {
    const response = await this.fetchIssues(
      `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/search?jql=sprint=${sprintId} AND project=${project}`
    )
    return response
  }

  async getBacklogIssuesByProjectAndBoard(
    project: string,
    boardId: number
  ): Promise<Issue[]> {
    const response = await this.fetchIssues(
      `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/agile/1.0/board/${boardId}/backlog?jql=sprint is EMPTY AND project=${project}`
    )

    return response
  }

  async fetchIssues(url: string): Promise<Issue[]> {
    const rankCustomField = this.customFields.get("Rank") || ""
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
    })
    const data = await response.json()

    const issues: Promise<Issue[]> = Promise.all(
      data.issues.map(async (element: JiraIssue) => ({
        issueKey: element.key,
        summary: element.fields.summary,
        creator: element.fields.creator.displayName,
        status: element.fields.status.name,
        type: element.fields.issuetype.name,
        storyPointsEstimate: await this.getIssueStoryPointsEstimate(
          element.key
        ),
        epic: element.fields.parent?.fields.summary,
        labels: element.fields.labels,
        assignee: {
          displayName: element.fields.assignee?.displayName,
          avatarUrls: element.fields.assignee?.avatarUrls,
        },
        rank: element.fields[rankCustomField],
      }))
    )

    return issues
  }

  async moveIssueToSprintAndRank(
    sprint: number,
    issue: string,
    rankBefore: string,
    rankAfter: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const rankCustomField = this.customFields.get("Rank")
      const body = {
        rankCustomFieldId: rankCustomField!.match(/_(\d+)/)![1],
        issues: [issue],
        ...(rankAfter ? { rankAfterIssue: rankAfter } : {}),
        ...(rankBefore ? { rankBeforeIssue: rankBefore } : {}),
      }
      fetch(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/agile/1.0/sprint/${sprint}/issue`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      )
        .then(() => resolve())
        .catch((error) => {
          reject(
            new Error(
              `Error in moving this issue to the Sprint with id ${sprint}: ${error}`
            )
          )
        })
    })
  }

  async moveIssueToBacklog(issue: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fetch(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/agile/1.0/backlog/issue`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: `{
            "issues": [
              "${issue}"
            ]
          }`,
        }
      )
        .then(() => resolve())
        .catch((error) =>
          reject(
            new Error(`Error in moving this issue to the Backlog: ${error}`)
          )
        )
    })
  }

  async rankIssueInBacklog(
    issue: string,
    rankBefore: string,
    rankAfter: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const rankCustomField = this.customFields.get("Rank")
      const body: {
        rankCustomFieldId: string
        issues: string[]
        rankBeforeIssue?: string
        rankAfterIssue?: string
      } = {
        rankCustomFieldId: rankCustomField!.match(/_(\d+)/)![1],
        issues: [issue],
      }
      if (rankBefore) {
        body.rankBeforeIssue = rankBefore
      } else if (rankAfter) {
        body.rankAfterIssue = rankAfter
      }

      fetch(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/agile/1.0/issue/rank`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      )
        .then(() => resolve())
        .catch((error) =>
          reject(
            new Error(`Error in moving this issue to the Backlog: ${error}`)
          )
        )
    })
  }

  async getIssueStoryPointsEstimate(issue: string): Promise<number> {
    return new Promise((resolve, reject) => {
      fetch(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/issue/${issue}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )
        .then(async (response) => {
          const data = await response.json()
          const customField = this.customFields.get("Story point estimate")
          const points: number = data.fields[customField!]

          resolve(points)
          return points
        })
        .catch((error) =>
          reject(
            new Error(
              `Error in getting the story points for issue: ${issue}: ${error}`
            )
          )
        )
    })
  }

  async createIssue({
    summary,
    type,
    projectId,
    reporter,
    assignee,
    // sprintId,
    // storyPointsEstimate,
    description,
  }: // status,
  Issue): Promise<string> {
    const createdIssue = await fetch(
      `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/issue`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            summary,
            issuetype: { id: type },
            project: {
              id: projectId,
            },
            reporter: {
              id: reporter,
            },
            assignee,
            description: {
              type: "doc",
              version: 1,
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      text: description,
                      type: "text",
                    },
                  ],
                },
              ],
            },
            // [this.customFields.get("Sprint")!]: sprintId,
            // [this.customFields.get("Story point estimate")!]:
            //   storyPointsEstimate,
          },
        }),
      }
    ).then((data) => data.json())
    // console.log(createdIssue)
    // this.setTransition(SuccessJson.id, status)
    return createdIssue.key
  }

  async setTransition(issueKey: string, status: string): Promise<void> {
    const transitions = new Map<string, string>()
    const transitonResponse = await fetch(
      `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/issue/${issueKey}/transitions`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    )

    const data = await transitonResponse.json()

    data.transitions.forEach((field: { name: string; id: string }) => {
      transitions.set(field.name, field.id)
    })
    const transitionId = +transitions.get(status)!

    fetch(
      `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/issue/${issueKey}/transitions`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transition: { id: transitionId } }),
      }
    )
  }
}
export class JiraCloudProviderCreator extends ProviderCreator {
  public factoryMethod(): ProviderApi {
    return new JiraCloudProvider()
  }
}
