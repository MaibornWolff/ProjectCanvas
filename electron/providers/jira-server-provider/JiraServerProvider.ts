/* eslint-disable class-methods-use-this */
import fetch from "cross-fetch"
import {
  dateTimeFormat,
  Issue,
  IssueType,
  Priority,
  Project,
  Resource,
  Sprint,
  SprintCreate,
  User,
} from "../../../types"
import {
  JiraIssue,
  JiraIssueType,
  JiraProject,
  JiraSprint,
} from "../../../types/jira"
import { IProvider } from "../base-provider"
import axios, { AxiosError, isAxiosError } from "axios";

export class JiraServerProvider implements IProvider {
  private loginOptions = {
    url: "",
    username: "",
    password: "",
  }

  private customFields = new Map<string, string>()

  private getAuthHeader() {
    return `Basic ${Buffer.from(
      `${this.loginOptions.username}:${this.loginOptions.password}`
    ).toString("base64")}`
  }

  private constructRestBasedClient(apiName: string, version: string) {
    const instance = axios.create({
      baseURL: `${this.loginOptions.url}/rest/${apiName}/${version}`,
      headers: {
        Accept: "application/json",
        Authorization: this.getAuthHeader(),
        "Content-Type": "application/json",
      },
    })

    const recreateAxiosError = (originalError: AxiosError, message: string) => new AxiosError(
        message,
        originalError.code,
        originalError.config,
        originalError.request,
        originalError.response
    )

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
          if (isAxiosError(error) && error.response) {
            const statusCode = error.response.status
            if (statusCode === 400) {
              return Promise.reject(recreateAxiosError(error, `Invalid request: ${JSON.stringify(error.response.data)}`))
            } else if (statusCode === 401) {
              return Promise.reject(recreateAxiosError(error, `User not authenticated: ${JSON.stringify(error.response.data)}`))
            } else if (error.response.status === 403) {
              return Promise.reject(recreateAxiosError(error, `User does not have a valid licence: ${JSON.stringify(error.response.data)}`))
            } else if (error.response.status === 429) {
              return Promise.reject(recreateAxiosError(error, `Rate limit exceeded: ${JSON.stringify(error.response.data)}`))
            }
          }

          return Promise.reject(error)
        }
    )

    return instance
  }

  private getRestApiClient(version: number) {
    return this.constructRestBasedClient('api', version.toString());
  }

  private getAuthRestApiClient(version: number) {
    return this.constructRestBasedClient('auth', version.toString());
  }

  private getAgileRestApiClient(version: string) {
    return this.constructRestBasedClient('agile', version);
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

    // await this.mapCustomFields()
    return this.isLoggedIn()
  }

  async isLoggedIn(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getAuthRestApiClient(1)
        .get('/session')
        .then(() => { resolve() })
        .catch((error) => {
          if (isAxiosError(error) && error.response) {
            if (error.response.status === 401) {
              return Promise.reject(new Error("Wrong Username or Password"))
            } else if (error.response.status === 404) {
              return Promise.reject(new Error("Wrong URL"))
            }
          }
        })
        .catch((error) => {
          reject(new Error(`Error in checking login status: ${error}`))
        })
    })
  }

  async logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getAuthRestApiClient(1)
        .delete('/session')
        .then(() => { resolve() })
        .catch((error) => {
          reject(new Error(`Error in logging out: ${error}`))
        })
    })
  }

  async mapCustomFields(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .delete('/field')
        .then((response) => {
          response.data.forEach((field: { name: string; id: string }) => {
            this.customFields.set(field.name, field.id)
          })
          resolve()
        })
        .catch((error) => {
          reject(new Error(`Error in mapping custom fields: ${error}`))
        })
    })
  }

  async getProjects(): Promise<Project[]> {
    return new Promise((resolve, _) => {
      this.getRestApiClient(2)
        .get('/project?expand=lead,description')
        .then((response) => {
          const projects = response.data.map((project: JiraProject) => ({
            key: project.key,
            name: project.name,
            id: project.id,
            lead: project.lead.displayName,
            type: project.projectTypeKey,
          }))
          resolve(projects)
        })
    })
  }

  async getIssueTypesByProject(projectIdOrKey: string): Promise<IssueType[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get(`/project/${projectIdOrKey}/statuses`)
        .then(async (response) => {
          const issueTypes: JiraIssueType[] = response.data
          resolve(issueTypes as IssueType[])
        })
        .catch((error) => reject(new Error(`Error in fetching the issue types: ${error}`)))
    })
  }

  async getBoardIds(project: string): Promise<number[]> {
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient('1.0')
        .get(`/board?projectKeyOrId=${project}`)
        .then(async (response) => {
          const boardIds: number[] = response.data.values.map(
            (element: { id: number; name: string }) => element.id
          )
          resolve(boardIds)
        })
        .catch((error) => reject(new Error(`Error in fetching the boards: ${error}`)))
    })
  }

  async getSprints(boardId: number): Promise<Sprint[]> {
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient('1.0')
        .get(`/board/${boardId}/sprint`)
        .then(async (response) => {
          const sprints: Sprint[] = response.data.values
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
          resolve(sprints)
        })
        .catch((error) => reject(new Error(`Error in fetching the boards: ${error}`)))
    })
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
      this.getAgileRestApiClient('1.0')
        .post(
          `/sprint/${sprint}/issue`,
          {
            rankCustomFieldId: rankCustomField!.match(/_(\d+)/)![1],
            issues: [issue],
            ...(rankAfter && { rankAfterIssue: rankAfter }),
            ...(rankBefore && { rankBeforeIssue: rankBefore }),
          }
        )
        .then(() => resolve())
        .catch((error) => {
          reject(new Error(`Error in moving this issue to the Sprint with id ${sprint}: ${error}`))
        })
    })
  }

  async moveIssueToBacklog(issue: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient('1.0')
        .post(
          '/backlog/issue',
          { issues: [issue] }
        )
        .then(() => resolve())
        .catch((error) =>
          reject(new Error(`Error in moving this issue to the Backlog: ${error}`))
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
      this.getAgileRestApiClient('1.0')
        .put('/issue/rank', body)
        .then(() => resolve())
        .catch((error) =>
          reject(new Error(`Error in moving this issue to the Backlog: ${error}`))
        )
    })
  }

  async getIssueStoryPointsEstimate(issue: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get(`/issue/${issue}`)
        .then(async (response) => {
          const customField = this.customFields.get("Story Points")
          const points: number = response.data.fields[customField!]

          resolve(points)
        })
        .catch((error) =>
          reject(new Error(`Error in getting the story points for issue: ${issue}: ${error}`))
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

  getResource(): Promise<Resource> {
    throw new Error("Method not implemented.")
  }

  createSprint(sprint: SprintCreate): Promise<void> {
    throw new Error("Method not implemented.")
  }

  deleteIssue(issueIdOrKey: string): Promise<void> {
    throw new Error("Method not implemented for Jira Server")
  }

  createSubtask(
    parentIssueKey: string,
    projectId: string,
    subtaskSummary: string,
    subtaskIssueTypeId: string
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

  refreshAccessToken(oauthRefreshOptions: {
    clientId: string
    clientSecret: string
  }): Promise<void> {
    throw new Error("Method not implemented for Jira Server")
  }
}
