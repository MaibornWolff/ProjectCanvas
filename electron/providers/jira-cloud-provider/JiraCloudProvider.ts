/* eslint-disable class-methods-use-this */
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
  JiraPriority,
  JiraProject,
  JiraSprint,
} from "../../../types/jira"
import { IProvider } from "../base-provider"
import { getAccessToken, refreshTokens } from "./getAccessToken"
import { AxiosResponse } from "axios"
import axios from "axios"

export class JiraCloudProvider implements IProvider {
  public accessToken: string | undefined

  public refreshToken: string | undefined

  private cloudID = ""

  private customFields = new Map<string, string>()

  private reversedCustomFields = new Map<string, string>()

  private constructRestBasedClient(basePath: string, version: string) {
    // TODO catch errors and handle common status codes
    const instance = axios.create({
      baseURL: `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/${basePath}/${version}`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      validateStatus: (statusCode) => statusCode < 500,
    })

    instance.interceptors.response.use((response) => {
      if (response.status === 401) {
        return Promise.reject(new Error(`User not authenticated: ${JSON.stringify(response.data)}`))
      }

      return response
    })

    return instance
  }

  private getRestApiClient(version: number) {
    return this.constructRestBasedClient('api', version.toString());
  }

  private getAgileRestApiClient(version: string) {
    return this.constructRestBasedClient('agile', version);
  }

  offsetDate(date: Date) {
    if (!date) {
      return date
    }
    const convertedDate = new Date(date)
    const timezoneOffset = convertedDate.getTimezoneOffset()
    return new Date(convertedDate.getTime() - timezoneOffset * 60 * 1000)
  }

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
    if (this.accessToken === undefined) {
      const tokenObject = await getAccessToken(oauthLoginOptions)
      this.accessToken = tokenObject.accessToken
      this.refreshToken = tokenObject.refreshToken
    }
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

  async refreshAccessToken(oauthRefreshOptions: {
    clientId: string
    clientSecret: string
  }): Promise<void> {
    if (this.refreshToken) {
      const { clientId, clientSecret } = oauthRefreshOptions
      try {
        const { accessToken, refreshToken } = await refreshTokens({
          clientId,
          clientSecret,
          _refreshToken: this.refreshToken,
        })
        this.accessToken = accessToken
        this.refreshToken = refreshToken
        return await Promise.resolve()
      } catch (error) {
        return Promise.reject(
          new Error(`Error refreshing the access token: ${error}`)
        )
      }
    }
    return Promise.reject(new Error("Error refreshing the access token"))
  }

  logout(): Promise<void> {
    return new Promise((resolve) => {
      this.accessToken = undefined
      this.refreshToken = undefined
      resolve()
    })
  }

  async mapCustomFields(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get('/field')
        .then(async (response) => {
          if (response.status === 200) {
            response.data.forEach((field: { name: string; id: string }) => {
              this.customFields.set(field.name, field.id)
              this.reversedCustomFields.set(field.id, field.name)
            })
            resolve()
          } else {
            reject(new Error(`Unknown error: ${response.data}`))
          }
        })
        .catch((error) => {
          reject(new Error(`Error creating issue: ${error}`))
        })
    })
  }

  async getProjects(): Promise<Project[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get('/project/search?expand=description,lead,issueTypes,url,projectKeys,permissions,insight')
        .then(async (response) => {
          const data = response.data
          if (response.status === 200) {
            const projects = data.values.map((project: JiraProject) => ({
              key: project.key,
              name: project.name,
              id: project.id,
              lead: project.lead.displayName,
              type: project.projectTypeKey,
            }))
            resolve(projects)
          } else if (response.status === 400) {
            reject(new Error(`Invalid request: ${data}`))
          } else if (response.status === 404) {
            reject(
              new Error(
                `No projects matching the search criteria were found: ${data}`
              )
            )
          } else {
            reject(new Error(`Unknown error: ${data}`))
          }
        })
        .catch((error) => {
          reject(new Error(`Error getting projects: ${error}`))
        })
    })
  }

  async getIssueTypesByProject(projectIdOrKey: string): Promise<IssueType[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get(`/project/${projectIdOrKey}/statuses`)
        .then(async (response) => {
          const data = response.data
          if (response.status === 200) {
            const issueTypes: JiraIssueType[] = data
            resolve(issueTypes as IssueType[])
          } else if (response.status === 404) {
            reject(
              new Error(`The project was not found or the user does not have permission to view it: ${data}`)
            )
          } else {
            reject(new Error(`Unknown error: ${data}`))
          }
        })
        .catch((error) =>
          reject(new Error(`Error in fetching the issue types: ${error}`))
        )
    })
  }

  async getIssueTypesWithFieldsMap(): Promise<{ [key: string]: string[] }> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get('/issue/createmeta?expand=projects.issuetypes.fields')
        .then(async (response) => {
          const metadata = response.data
          if (response.status === 200) {
            const issueTypeToFieldsMap: { [key: string]: string[] } = {}
            metadata.projects.forEach(
              (project: {
                id: string
                issuetypes: {
                  fields: {}
                  id: string
                }[]
              }) => {
                project.issuetypes.forEach((issueType) => {
                  const fieldKeys = Object.keys(issueType.fields)
                  issueTypeToFieldsMap[issueType.id] = fieldKeys.map(
                    (fieldKey) => this.reversedCustomFields.get(fieldKey)!
                  )
                })
              }
            )
            resolve(issueTypeToFieldsMap)
          } else {
            reject(new Error(`Unknown error: ${metadata}`))
          }
        })
        .catch((error) =>
          reject(new Error(`Error in fetching the issue types map: ${error}`))
        )
    })
  }

  async getEditableIssueFields(issueIdOrKey: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get(`/issue/${issueIdOrKey}/editmeta`)
        .then(async (response) => {
          const metadata = response.data
          if (response.status === 200) {
            const fieldKeys = Object.keys(metadata.fields).map(
              (fieldKey) => this.reversedCustomFields.get(fieldKey)!
            )
            resolve(fieldKeys)
          } else {
            reject(new Error(`Unknown error: ${metadata}`))
          }
        })
        .catch((error) =>
          reject(new Error(`Error in fetching the issue types map: ${error}`))
        )
    })
  }

  async getAssignableUsersByProject(projectIdOrKey: string): Promise<User[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get(`/user/assignable/search?project=${projectIdOrKey}`)
        .then(async (response) => {
          const data = response.data
          if (response.status === 200) {
            const users: User[] = data
            resolve(users as User[])
          } else if (response.status === 400) {
            reject(new Error(`Some infos are missing: ${data}`))
          } else if (response.status === 404) {
            reject(
              new Error(`Project, issue, or transition were not found: ${data}`)
            )
          } else if (response.status === 429) {
            reject(new Error(`Rate limit exceeded: ${data}`))
          } else {
            reject(new Error(`Unknown error: ${data}`))
          }
        })
        .catch((error) =>
          reject(
            new Error(`Error in fetching the assignable users for the project ${projectIdOrKey}: ${error}`)
          )
        )
    })
  }

  async getCurrentUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get('/myself')
        .then(async (response) => {
          const data = response.data
          if (response.status === 200) {
            const user: User = data
            resolve(user as User)
          } else {
            reject(new Error(`Unknown error: ${data}`))
          }
        })
        .catch((error) =>
          reject(new Error(`Error in fetching the current user: ${error}`))
        )
    })
  }

  async getIssueReporter(issueIdOrKey: string): Promise<User> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get(`/issue/${issueIdOrKey}?fields=reporter`)
        .then(async (response) => {
          const user = response.data
          if (response.status === 200) {
            resolve(user.fields.reporter as User)
          } else if (response.status === 404) {
            reject(
              new Error(`The issue was not found or the user does not have permission to view it: ${user}`)
            )
          } else {
            reject(new Error(`Unknown error: ${user}`))
          }
        })
        .catch((error) =>
          reject(new Error(`Error in fetching the current user: ${error}`))
        )
    })
  }

  async getBoardIds(project: string): Promise<number[]> {
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient('1.0')
        .get(`/board?projectKeyOrId=${project}`)
        .then(async (response) => {
          const data = response.data
          if (response.status === 200) {
            const boardIds: number[] = data.values.map(
              (element: { id: number; name: string }) => element.id
            )
            resolve(boardIds)
          } else if (response.status === 400) {
            reject(new Error(`Invalid request: ${data}`))
          } else if (response.status === 403) {
            reject(new Error(`User does not have a valid licence: ${data}`))
          } else {
            reject(new Error(`Unknown error: ${data}`))
          }
        })
        .catch((error) => {
          reject(new Error(`Error getting projects: ${error}`))
        })
    })
  }

  async getSprints(boardId: number): Promise<Sprint[]> {
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient('1.0')
        .get(`/board/${boardId}/sprint`)
        .then(async (response) => {
          if (response.status === 200) {
            const sprints: Sprint[] = response.data.values
              .filter(
                (element: { state: string }) => element.state !== "closed"
              )
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
          } else if (response.status === 400) {
            reject(new Error(`Invalid request: ${response.data}`))
          } else if (response.status === 403) {
            reject(new Error(`User does not have a valid licence: ${response.data}`))
          } else if (response.status === 404) {
            reject(
              new Error(
                `The board does not exist or the user does not have permission to view it: ${response.data}`
              )
            )
          } else {
            reject(new Error(`Unknown error: ${response.data}`))
          }
        })
        .catch((error) => {
          reject(new Error(`Error fetching the sprints: ${error}`))
        })
    })
  }

  async getIssuesByProject(project: string): Promise<Issue[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get(`/search?jql=project=${project}&maxResults=10000`)
        .then(async (response) => {
          resolve(this.fetchIssues(response))
        })
        .catch((error) => {
          reject(new Error(`Error fetching issues by project: ${error}`))
        })
    })
  }

  async getIssuesBySprint(sprintId: number): Promise<Issue[]> {
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient('1.0')
        .get(`/sprint/${sprintId}/issue`)
        .then(async (response) => {
          resolve(this.fetchIssues(response))
        })
        .catch((error) => {
          reject(new Error(`Error fetching issues by sprint: ${error}`))
        })
    })
  }

  async getBacklogIssuesByProjectAndBoard(
    project: string,
    boardId: number
  ): Promise<Issue[]> {
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient('1.0')
        .get(`/board/${boardId}/backlog?jql=project=${project}&maxResults=500`)
        .then(async (response) => {
          resolve(this.fetchIssues(response))
        })
        .catch((error) => {
          reject(new Error(`Error fetching issues by project: ${error}`))
        })
    })
  }

  async fetchIssues(response: AxiosResponse): Promise<Issue[]> {
    const rankCustomField = this.customFields.get("Rank") || ""
    return new Promise((resolve, reject) => {
      const data = response.data
      if (response.status === 200) {
        const issues: Promise<Issue[]> = Promise.all(
          data.issues.map(async (element: JiraIssue) => ({
            issueKey: element.key,
            summary: element.fields.summary,
            creator: element.fields.creator.displayName,
            status: element.fields.status.name,
            type: element.fields.issuetype.name,
            storyPointsEstimate: await this.getIssueStoryPointsEstimate(element.key),
            epic: element.fields.parent?.fields.summary,
            labels: element.fields.labels,
            assignee: {
              displayName: element.fields.assignee?.displayName,
              avatarUrls: element.fields.assignee?.avatarUrls,
            },
            rank: element.fields[rankCustomField],
            description: element.fields.description,
            subtasks: element.fields.subtasks,
            created: element.fields.created,
            updated: element.fields.updated,
            comment: element.fields.comment,
            projectId: element.fields.project.id,
            sprint: element.fields.sprint,
            attachments: element.fields.attachment,
          }))
        )
        resolve(issues)
      } else if (response.status === 400) {
        reject(new Error(`Invalid request: ${data}`))
      } else if (response.status === 403) {
        reject(new Error(`User does not have a valid licence: ${data}`))
      } else if (response.status === 404) {
        reject(
          new Error(`The board does not exist or the user does not have permission to view it: ${data}`)
        )
      } else {
        reject(new Error(`Unknown error: ${data}`))
      }
    })
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
            ...(rankAfter ? { rankAfterIssue: rankAfter } : {}),
            ...(rankBefore ? { rankBeforeIssue: rankBefore } : {}),
          }
        )
        .then(async (response) => {
          const data = response.data
          if (response.status === 204) {
            resolve()
          } else if (response.status === 400) {
            reject(new Error(`Invalid request: ${data}`))
          } else if (response.status === 403) {
            reject(new Error(`User does not have a valid licence or permissions to assign issues: ${data}`))
          } else if (response.status === 404) {
            reject(
              new Error(`The sprint does not exist or the user does not have permission to view it: ${data}`)
            )
          } else {
            reject(new Error(`Unknown error: ${data}`))
          }
        })
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
        .then(async (response) => {
          const data = response.data
          if (response.status === 204) {
            resolve()
          } else if (response.status === 400) {
            reject(new Error(`Invalid request: ${data}`))
          } else if (response.status === 403) {
            reject(new Error(`User does not have a valid licence or permissions to assign issues: ${data}`))
          } else if (response.status === 404) {
            reject(
              new Error(`The board does not exist or the user does not have permission to view it: ${data}`)
            )
          } else {
            reject(new Error(`Unknown error: ${data}`))
          }
        })
        .catch((error) => {
          reject(new Error(`Error in moving this issue to the backlog: ${error}`))
        })
    })
  }

  async rankIssueInBacklog(
    issue: string,
    rankBefore: string,
    rankAfter: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!rankBefore && !rankAfter) resolve()
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
        .then(async (response) => {
          const data = response.data
          if (response.status === 204) {
            resolve()
          } else if (response.status === 207) {
            // Returns the list of issues with status of rank operation.
            // see documentation: https://developer.atlassian.com/cloud/jira/software/rest/api-group-issue/#api-rest-agile-1-0-issue-rank-put-responses
            resolve()
          } else if (response.status === 400) {
            reject(new Error(`Invalid request: ${data}`))
          } else if (response.status === 403) {
            reject(new Error(`User does not have a valid licence or permissions to rank issues: ${data}`))
          } else {
            reject(new Error(`Unknown error: ${data}`))
          }
        })
        .catch((error) => {
          reject(new Error(`Error in moving this issue to the backlog: ${error}`))
        })
    })
  }

  async getIssueStoryPointsEstimate(issue: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get(`/issue/${issue}`)
        .then(async (response) => {
          const data = response.data
          if (response.status === 200) {
            const customField = this.customFields.get("Story point estimate")
            const points: number = data.fields[customField!]

            resolve(points)
          } else if (response.status === 404) {
            reject(
              new Error(`The issue was not found or the user does not have permission to view it: ${data}`)
            )
          } else {
            reject(new Error(`Unknown error: ${data}`))
          }
        })
        .catch((error) =>
          reject(new Error(`Error in getting the story points for issue: ${issue}: ${error}`))
        )
    })
  }

  async createIssue({
    summary,
    type,
    projectId,
    reporter,
    assignee,
    sprint,
    storyPointsEstimate,
    description,
    status,
    epic,
    startDate,
    dueDate,
    labels,
    priority,
  }: Issue): Promise<string> {
    const offsetStartDate = this.offsetDate(startDate)
    const offsetDueDate = this.offsetDate(dueDate)

    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .post(
          `/issue`,
          {
            fields: {
              summary,
              parent: { key: epic },
              issuetype: { id: type },
              project: {
                id: projectId,
              },
              reporter: {
                id: reporter,
              },
              ...(priority.id && { priority }),
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
              labels,
              ...(offsetStartDate && {
                [this.customFields.get("Start date")!]: offsetStartDate,
              }),
              ...(offsetDueDate && {
                [this.customFields.get("Due date")!]: offsetDueDate,
              }),
              ...(sprint &&
                sprint.id && {
                  [this.customFields.get("Sprint")!]: +sprint.id,
                }),
              ...(storyPointsEstimate && {
                [this.customFields.get("Story point estimate")!]:
                storyPointsEstimate,
              }),
              // ...(files && {
              //   [this.customFields.get("Attachment")!]: files,
              // }),
            },
          }
        )
        .then(async (response) => {
          const createdIssue = response.data
          if (response.status === 201) {
            resolve(JSON.stringify(createdIssue.key))
            this.setTransition(createdIssue.id, status)
          } else if (response.status === 400) {
            reject(new Error(createdIssue))
          } else if (response.status === 403) {
            reject(new Error("The user does not have the necessary permissions"))
          }
        })
        .catch((error) => {
          reject(new Error(`Error creating issue: ${error}`))
        })
    })
  }

  async editIssue(
    {
      summary,
      type,
      projectId,
      reporter,
      assignee,
      sprint,
      storyPointsEstimate,
      description,
      epic,
      startDate,
      dueDate,
      labels,
      priority,
    }: Issue,
    issueIdOrKey: string
  ): Promise<void> {
    const offsetStartDate = this.offsetDate(startDate)
    const offsetDueDate = this.offsetDate(dueDate)

    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .put(
          `/issue/${issueIdOrKey}`,
          {
            fields: {
              ...(summary && {
                summary,
              }),
              ...(epic && {
                parent: { key: epic },
              }),
              ...(type && {
                issuetype: { id: type },
              }),
              ...(projectId && {
                project: {
                  id: projectId,
                },
              }),
              ...(reporter && {
                reporter: {
                  id: reporter,
                },
              }),
              ...(priority && priority.id && { priority }),
              ...(assignee &&
                assignee.id && {
                  assignee,
                }),
              ...(description && {
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
              }),
              ...(labels && {
                labels,
              }),
              ...(offsetStartDate && {
                [this.customFields.get("Start date")!]: offsetStartDate,
              }),
              ...(offsetDueDate && {
                [this.customFields.get("Due date")!]: offsetDueDate,
              }),
              ...(sprint && {
                [this.customFields.get("Sprint")!]: sprint.id,
              }),
              ...(storyPointsEstimate !== undefined && {
                [this.customFields.get("Story point estimate")!]:
                storyPointsEstimate,
              }),
            },
          }
        )
        .then(async (response) => {
          if (response.status === 204) {
            resolve()
          }
          if (response.status === 400) {
            reject(new Error("400 Error: consult the atlassian rest api v3 under Edit issue for information"))
          }
          if (response.status === 403) {
            reject(new Error("The user does not have the necessary permissions"))
          }
          if (response.status === 404) {
            reject(new Error("The issue was not found or the user does not have the necessary permissions"))
          }
        })
        .catch(async (error) => {
          reject(new Error(`Error creating issue: ${error}`))
        })
    })
  }

  async setTransition(issueKey: string, status: string): Promise<void> {
    const transitions = new Map<string, string>()
    const transitionResponse = await this.getRestApiClient(3).get(
      `/issue/${issueKey}/transitions`,
    )

    const data = transitionResponse.data

    data.transitions.forEach((field: { name: string; id: string }) => {
      transitions.set(field.name, field.id)
    })
    const transitionId = +transitions.get(status)!

    this.getRestApiClient(3).post(
      `/issue/${issueKey}/transitions`,
      { transition: { id: transitionId } }
    )
  }

  async getEpicsByProject(projectIdOrKey: string): Promise<Issue[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get(`search?jql=issuetype = Epic AND project = ${projectIdOrKey}`)
        .then(async (response) => {
          const epicData = response.data
          if (response.status === 200) {
            const epics: Promise<Issue[]> = Promise.all(
              epicData.issues.map(async (element: JiraIssue) => ({
                issueKey: element.key,
                summary: element.fields.summary,
                labels: element.fields.labels,
                assignee: {
                  displayName: element.fields.assignee?.displayName,
                  avatarUrls: element.fields.assignee?.avatarUrls,
                },
              }))
            )
            resolve(epics)
          } else if (response.status === 400) {
            reject(new Error(`Invalid request: ${epicData}`))
          } else if (response.status === 403) {
            reject(new Error(`User does not have a valid licence: ${epicData}`))
          } else if (response.status === 404) {
            reject(
              new Error(
                `The board does not exist or the user does not have permission to view it: ${epicData}`
              )
            )
          } else {
            reject(new Error(`Unknown error: ${epicData}`))
          }
        })
        .catch((error) =>
          reject(new Error(`Error in fetching the epics for the project ${projectIdOrKey}: ${error}`))
        )
    })
  }

  async getLabels(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get('/label')
        .then(async (response) => {
          const labelData = response.data
          if (response.status === 200) {
            resolve(labelData.values)
          } else {
            reject(new Error(`Unknown error: ${labelData}`))
          }
        })
        .catch((error) =>
          reject(new Error(`Error in fetching the labels: ${error}`))
        )
    })
  }

  async getPriorities(): Promise<Priority[]> {
    // WARNING: currently (15.03.2023) GET /rest/api/3/priority is deprecated
    // and GET /rest/api/3/priority/search is experimental
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get('/priority/search')
        .then(async (response) => {
          const priorityData: JiraPriority = response.data
          if (response.status === 200) {
            const priorities: Priority[] = priorityData.values
            resolve(priorities)
          } else {
            reject(new Error(`Unknown error: ${priorityData}`))
          }
        })
        .catch((error) =>
          reject(new Error(`Error in fetching the labels: ${error}`))
        )
    })
  }

  async addCommentToIssue(
    issueIdOrKey: string,
    commentText: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .post(
          `/issue/${issueIdOrKey}/comment`,
          {
            body: {
              content: [
                {
                  content: [
                    {
                      text: commentText.replace(/\n/g, " "),
                      type: "text"
                    }
                  ],
                  type: "paragraph"
                }
              ],
              type: "doc",
              version: 1
            }
          }
        )
        .then(async (response) => {
          if (response.status === 201) {
            resolve()
          } else if (response.status === 400) {
            reject(new Error("Invalid api request"))
          } else if (response.status === 404) {
            reject(new Error("The issue was not found or the user does not have the necessary permissions"))
          }
        })
        .catch(async (error) => {
          reject(new Error(`Error adding a comment to the issue ${issueIdOrKey}: ${error}`))
        })
    })
  }

  async editIssueComment(
    issueIdOrKey: string,
    commentId: string,
    commentText: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .put(
          `/issue/${issueIdOrKey}/comment/${commentId}`,
          {
            body: {
              content: [
                {
                  content: [
                    {
                      text: commentText.replace(/\n/g, " "),
                      type: "text"
                    }
                  ],
                  type: "paragraph"
                }
              ],
              type: "doc",
              version: 1
            }
          }
        )
        .then(async (response) => {
          if (response.status === 200) {
            resolve()
          } else if (response.status === 400) {
            reject(
              new Error("The user does not have permission to edit the comment or the request is invalid")
            )
          } else if (response.status === 404) {
            reject(new Error("The issue was not found or the user does not have the necessary permissions"))
          }
        })
        .catch(async (error) => {
          reject(new Error(`Error editing the comment in issue ${issueIdOrKey}: ${error}`))
        })
    })
  }

  deleteIssueComment(issueIdOrKey: string, commentId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .delete(`/issue/${issueIdOrKey}/comment/${commentId}`)
        .then(async (response) => {
          if (response.status === 204) {
            resolve()
          } else if (response.status === 400) {
            reject(new Error("The user does not have permission to delete the comment"))
          } else if (response.status === 404) {
            reject(new Error("The issue  was not found or the user does not have the necessary permissions"))
          } else if (response.status === 405) {
            reject(new Error("An anonymous call has been made to the operation"))
          }
        })
        .catch(async (error) => {
          reject(new Error(`Error editing the comment in issue ${issueIdOrKey}: ${error}`))
        })
    })
  }

  deleteIssue(issueIdOrKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .delete(`/issue/${issueIdOrKey}`)
        .then(async (response) => {
          if (response.status === 204) {
            resolve()
          } else if (response.status === 400) {
            reject(new Error("The issue has subtasks and deleteSubtasks is not set to true"))
          } else if (response.status === 403) {
            reject(new Error("The user does not have permission to delete the issue"))
          } else if (response.status === 404) {
            reject(new Error("The issue was not found or the user does not have the necessary permissions"))
          } else if (response.status === 405) {
            reject(new Error("An anonymous call has been made to the operation"))
          }
        })
        .catch(async (error) => {
          reject(new Error(`Error deleting the subtask ${issueIdOrKey}: ${error}`))
        })
    })
  }

  createSubtask(
    parentIssueKey: string,
    projectId: string,
    subtaskSummary: string,
    subtaskIssueTypeId: string
  ): Promise<{ id: string; key: string }> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .post(
          '/issue',
          {
            fields: {
              summary: subtaskSummary,
              issuetype: {
                id: subtaskIssueTypeId,
              },
              parent: {
                key: parentIssueKey,
              },
              project: {
                id: projectId,
              },
            },
          }
        )
        .then(async (response) => {
          const createdSubtask: { id: string; key: string } = response.data
          if (response.status === 201) {
            resolve(createdSubtask)
          } else if (response.status === 400) {
            reject(new Error(`Invalid request: ${createdSubtask}`))
          } else if (response.status === 403) {
            reject(new Error(`User does not have a valid licence: ${createdSubtask}`))
          } else {
            reject(new Error(`Unknown error: ${createdSubtask}`))
          }
        })
        .catch((error) => {
          reject(new Error(`Error creating subtask: ${error}`))
        })
    })
  }

  getResource(): Promise<Resource> {
    return new Promise<Resource>((resolve, reject) => {
      if (this.accessToken !== undefined) {
        const result: Resource = {
          baseUrl: `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/`,
          authorization: `Bearer ${this.accessToken}`,
        }
        resolve(result)
      } else {
        reject()
      }
    })
  }

  async createSprint({
    name,
    startDate,
    endDate,
    originBoardId,
    goal,
  }: SprintCreate): Promise<void> {
    const offsetStartDate = this.offsetDate(startDate)
    const offsetEndDate = this.offsetDate(endDate)

    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient('1.0')
        .post(
          '/sprint',
          {
            name,
            originBoardId,
            ...(offsetStartDate && {
              startDate: offsetStartDate,
            }),
            ...(offsetEndDate && {
              endDate: offsetEndDate,
            }),
            ...(goal && { goal }),
          }
        )
        .then(async (response) => {
          if (response.status === 201) {
            resolve()
          } else if (response.status === 400) {
            reject(new Error("Invalid request"))
          } else if (response.status === 403) {
            reject(new Error("The user does not have the necessary permissions"))
          } else if (response.status === 404) {
            reject(
              new Error(
                "The Board does not exists or the user does not have the necessary permissions to view it"
              )
            )
          }
        })
        .catch((error) => {
          reject(new Error(`Error creating sprint: ${error}`))
        })
    })
  }
}
