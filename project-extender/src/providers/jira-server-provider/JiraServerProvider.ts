/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import { fetch } from "cross-fetch"
import { ProviderApi, ProviderCreator } from "../base-provider"
import {
  dateTimeFormat,
  Issue,
  IssueType,
  Priority,
  Project,
  Sprint,
  User,
} from "../../types"
import {
  JiraIssue,
  JiraIssueType,
  JiraProject,
  JiraSprint,
} from "../../types/jira"

class JiraServerProvider implements ProviderApi {
  deleteIssue(issueIdOrKey: string): Promise<void> {
    throw new Error("Method not implemented for Jira Server")
  }

  createSubtask(
    parentIssueKey: string,
    projectId: string,
    summary: string
  ): Promise<{ id: string; key: string }> {
    throw new Error("Method not implemented for Jira Server")
  }

  editIssue(issue: Issue, issueIdOrKey: string): Promise<void> {
    throw new Error("Method not implemented for Jira Server")
  }

  setTransition(issueIdOrKey: string, targetStatus: string): Promise<void> {
    throw new Error("Method not implemented for Jira Server")
  }

  getEditableIssueFields(issueIdOrKey: string): Promise<string[]> {
    throw new Error("Method not implemented for Jira Server")
  }

  getIssueReporter(issueIdOrKey: string): Promise<User> {
    throw new Error("Method not implemented for Jira Server")
  }

  addCommentToIssue(issueIdOrKey: string, commentText: string): Promise<void> {
    throw new Error("Method not implemented for Jira Server")
  }

  editIssueComment(
    issueIdOrKey: string,
    commentId: string,
    commentText: string
  ): Promise<void> {
    throw new Error("Method not implemented for Jira Server")
  }

  deleteIssueComment(issueIdOrKey: string, commentId: string): Promise<void> {
    throw new Error("Method not implemented for Jira Server")
  }

  private loginOptions = {
    url: "",
    username: "",
    password: "",
  }

  private customFields = new Map<string, string>()

  getAuthHeader() {
    return `Basic ${Buffer.from(
      `${this.loginOptions.username}:${this.loginOptions.password}`
    ).toString("base64")}`
  }

  async login({
    basicLoginOptions,
  }: {
    basicLoginOptions: {
      url: string
      username: string
      password: string
    }
  }) {
    this.loginOptions.url = basicLoginOptions.url
    this.loginOptions.username = basicLoginOptions.username
    this.loginOptions.password = basicLoginOptions.password

    await this.mapCustomFields()
    return this.isLoggedIn()
  }

  async isLoggedIn(): Promise<void> {
    return new Promise((resolve, reject) => {
      fetch(`${this.loginOptions.url}/rest/auth/1/session`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: this.getAuthHeader(),
        },
      })
        .then((response) => {
          if (response.status === 200) resolve()
          if (response.status === 401) {
            reject(new Error("Wrong Username or Password"))
          }
          if (response.status === 404) {
            reject(new Error("Wrong URL"))
          }
        })
        .catch((err) => {
          if (err.name === "FetchError") reject(new Error("Wrong URL"))
        })
    })
  }

  async logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      fetch(`${this.loginOptions.url}/rest/auth/1/session`, {
        method: "DELETE",
        headers: {
          Authorization: this.getAuthHeader(),
        },
      }).then((res) => {
        if (res.status === 204) {
          resolve()
        }
        if (res.status === 401) {
          reject(new Error("user not authenticated"))
        }
      })
    })
  }

  async mapCustomFields(): Promise<void> {
    const response = await fetch(`${this.loginOptions.url}/rest/api/2/field`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: this.getAuthHeader(),
      },
    })
    const data = await response.json()
    data.forEach((field: { name: string; id: string }) => {
      this.customFields.set(field.name, field.id)
    })
  }

  async getProjects(): Promise<Project[]> {
    const response = await fetch(
      `${this.loginOptions.url}/rest/api/2/project?expand=lead,description`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: this.getAuthHeader(),
        },
      }
    )
    if (response.ok) {
      const data = await response.json()
      const projects = data.map((project: JiraProject) => ({
        key: project.key,
        name: project.name,
        id: project.id,
        lead: project.lead.displayName,
        type: project.projectTypeKey,
      }))
      return projects
    }
    return Promise.reject(new Error(response.statusText))
  }

  async getIssueTypesByProject(projectIdOrKey: string): Promise<IssueType[]> {
    return new Promise((resolve, reject) => {
      fetch(
        `${this.loginOptions.url}/rest/api/2/project/${projectIdOrKey}/statuses`,
        {
          headers: {
            Accept: "application/json",
            Authorization: this.getAuthHeader(),
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

  async getBoardIds(project: string): Promise<number[]> {
    const response = await fetch(
      `${this.loginOptions.url}/rest/agile/1.0/board?projectKeyOrId=${project}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: this.getAuthHeader(),
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
      `${this.loginOptions.url}/rest/agile/1.0/board/${boardId}/sprint`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: this.getAuthHeader(),
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

  async getIssuesByProject(project: string, boardId: number): Promise<Issue[]> {
    return this.fetchIssues(
      `${this.loginOptions.url}/rest/agile/1.0/board/${boardId}/issue?jql=project=${project}&maxResults=10000`
    )
  }

  async getIssuesBySprintAndProject(
    sprintId: number,
    project: string,
    boardId: number
  ): Promise<Issue[]> {
    return this.fetchIssues(
      `${this.loginOptions.url}/rest/agile/1.0/board/${boardId}/sprint/${sprintId}/issue?jql=project=${project}`
    )
  }

  async getBacklogIssuesByProjectAndBoard(
    project: string,
    boardId: number
  ): Promise<Issue[]> {
    return this.fetchIssues(
      `${this.loginOptions.url}/rest/agile/1.0/board/${boardId}/backlog?jql=sprint is EMPTY AND project=${project}`
    )
  }

  async fetchIssues(url: string): Promise<Issue[]> {
    const rankCustomField = this.customFields.get("Rank")
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: this.getAuthHeader(),
      },
    })

    const data = await response.json()

    const issues: Promise<Issue[]> = Promise.all(
      data.issues.map(async (element: JiraIssue) => ({
        issueKey: element.key,
        summary: element.fields.summary,
        creator: element.fields.creator.name,
        status: element.fields.status.name,
        type: element.fields.issuetype.name,
        storyPointsEstimate: await this.getIssueStoryPointsEstimate(
          element.key
        ),
        epic: element.fields.epic?.name,
        labels: element.fields.labels,
        assignee: {
          displayName: element.fields.assignee?.displayName,
          avatarUrls: element.fields.assignee?.avatarUrls,
        },
        rank: element.fields[rankCustomField!],
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
        ...(rankAfter && { rankAfterIssue: rankAfter }),
        ...(rankBefore && { rankBeforeIssue: rankBefore }),
      }
      fetch(`${this.loginOptions.url}/rest/agile/1.0/sprint/${sprint}/issue`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: this.getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
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
      fetch(`${this.loginOptions.url}/rest/agile/1.0/backlog/issue`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: this.getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: `{
          "issues": [
            "${issue}"
          ]
        }`,
      })
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
      fetch(`http://${this.loginOptions.url}/rest/agile/1.0/issue/rank`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: this.getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then(() => {
          resolve()
        })

        .catch((error) =>
          reject(
            new Error(`Error in moving this issue to the Backlog: ${error}`)
          )
        )
    })
  }

  async getIssueStoryPointsEstimate(issue: string): Promise<number> {
    return new Promise((resolve, reject) => {
      fetch(`${this.loginOptions.url}/rest/api/2/issue/${issue}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: this.getAuthHeader(),
        },
      })
        .then(async (response) => {
          const data = await response.json()
          const customField = this.customFields.get("Story Points")
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
  /* eslint-disable @typescript-eslint/no-unused-vars */

  getAssignableUsersByProject(projectIdOrKey: string): Promise<User[]> {
    throw new Error("Method not implemented for Jira Server")
  }

  createIssue(issue: Issue): Promise<string> {
    throw new Error("Method not implemented for Jira Server")
  }

  getEpicsByProject(projectIdOrKey: string): Promise<Issue[]> {
    throw new Error("Method not implemented for Jira Server")
  }

  getCurrentUser(): Promise<User> {
    throw new Error("Method not implemented for Jira Server")
  }

  getIssuesBySprint(sprintId: number): Promise<Issue[]> {
    throw new Error("Method not implemented for Jira Server")
  }

  getLabels(): Promise<string[]> {
    throw new Error("Method not implemented for Jira Server")
  }

  getPriorities(): Promise<Priority[]> {
    throw new Error("Method not implemented for Jira Server")
  }

  getIssueTypesWithFieldsMap(): Promise<{ [key: string]: string[] }> {
    throw new Error("Method not implemented for Jira Server")
  }

  refreshAccessToken(oauthRefreshOptions: {
    clientId: string
    clientSecret: string
  }): Promise<void> {
    throw new Error("Method not implemented for Jira Server")
  }
}

export class JiraServerProviderCreator extends ProviderCreator {
  public factoryMethod(): ProviderApi {
    return new JiraServerProvider()
  }
}
