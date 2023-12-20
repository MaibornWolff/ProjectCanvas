/* eslint-disable class-methods-use-this */
import axios, { AxiosError, AxiosResponse, isAxiosError } from "axios";
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
import {JiraCloudUser} from "./cloud-types";

export class JiraCloudProvider implements IProvider {
  public accessToken: string | undefined

  public refreshToken: string | undefined

  private cloudID = ""

  private customFields = new Map<string, string>()

  private reversedCustomFields = new Map<string, string>()

  private constructRestBasedClient(basePath: string, version: string) {
    const instance = axios.create({
      baseURL: `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/${basePath}/${version}`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.accessToken}`,
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
          } if (statusCode === 401) {
            return Promise.reject(recreateAxiosError(error, `User not authenticated: ${JSON.stringify(error.response.data)}`))
          } if (error.response.status === 403) {
            return Promise.reject(recreateAxiosError(error, `User does not have a valid licence: ${JSON.stringify(error.response.data)}`))
          } if (error.response.status === 429) {
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
          response.data.forEach((field: { name: string; id: string }) => {
            this.customFields.set(field.name, field.id)
            this.reversedCustomFields.set(field.id, field.name)
          })
          resolve()
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
          const projects = response.data.values.map((project: JiraProject) => ({
            key: project.key,
            name: project.name,
            id: project.id,
            lead: project.lead.displayName,
            type: project.projectTypeKey,
          }))
          resolve(projects)
        })
        .catch((error) => {
          let specificError = error
          if (error.response) {
            if (error.response.status === 404) {
              specificError = new Error(`No projects matching the search criteria were found: ${error.response.data}`)
            }
          }

          reject(new Error(`Error getting projects: ${specificError}`))
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
        .catch((error) => {
          let specificError = error
          if (error.response) {
            if (error.response.status === 404) {
              specificError = new Error(
                `The project was not found or the user does not have permission to view it: ${error.response.data}`
              )
            }
          }

          reject(new Error(`Error in fetching the issue types:  ${specificError}`))
        })
    })
  }

  async getIssueTypesWithFieldsMap(): Promise<{ [key: string]: string[] }> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get('/issue/createmeta?expand=projects.issuetypes.fields')
        .then(async (response) => {
          const issueTypeToFieldsMap: { [key: string]: string[] } = {}
          response.data.projects.forEach(
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
          const fieldKeys = Object.keys(response.data.fields).map(
            (fieldKey) => this.reversedCustomFields.get(fieldKey)!
          )
          resolve(fieldKeys)
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
          const users = response.data.map((cloudUser: JiraCloudUser) => ({
            id: cloudUser.accountId,
            name: cloudUser.name,
            avatarUrls: cloudUser.avatarUrls,
            displayName: cloudUser.displayName,
            emailAddress: cloudUser.emailAddress,
          } as User))

          resolve(users as User[])
        })
        .catch((error) => {
          let specificError = error
          if (error.response) {
            if (error.response.status === 404) {
              specificError = new Error(`Project, issue, or transition were not found: ${error.response.data}`)
            }
          }

          reject(new Error(`Error in fetching the assignable users for the project ${projectIdOrKey}: ${specificError}`))
        })
    })
  }

  async getCurrentUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get('/myself')
        .then(async (response: AxiosResponse<JiraCloudUser>) => {
          resolve({
            id: response.data.accountId,
            name: response.data.name,
            avatarUrls: response.data.avatarUrls,
            displayName: response.data.displayName,
            emailAddress: response.data.emailAddress,
          } as User)
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
          resolve(response.data.fields.reporter as User)
        })
        .catch((error) => {
          let specificError = error
          if (error.response) {
            if (error.response.status === 404) {
              specificError = new Error(
                `The issue was not found or the user does not have permission to view it: ${error.response.data}`
              )
            }
          }

          reject(new Error(`Error in fetching the issue reporter: ${specificError}`))
        })
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
        })
        .catch((error) => {
          let specificError = error
          if (error.response) {
            if (error.response.status === 404) {
              specificError = new Error(
                `The board does not exist or the user does not have permission to view it: ${error.response.data}`
              )
            }
          }

          reject(new Error(`Error fetching the sprints: ${specificError}`))
        })
    })
  }

  async getIssuesByProject(project: string): Promise<Issue[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get(`/search?jql=project=${project}&maxResults=10000&fields=*all`)
        .then(async (response) => {
          resolve(this.fetchIssues(response, false))
        })
        .catch((error) => {
          reject(new Error(`Error fetching issues by project: ${this.handleFetchIssuesError(error)}`))
        })
    })
  }

  async getIssuesBySprint(sprintId: number): Promise<Issue[]> {
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient('1.0')
        .get(`/sprint/${sprintId}/issue`)
        .then(async (response) => {
          resolve(this.fetchIssues(response, true))
        })
        .catch((error) => {
          reject(new Error(`Error fetching issues by sprint: ${this.handleFetchIssuesError(error)}`))
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
          resolve(this.fetchIssues(response, true))
        })
        .catch((error) => {
          reject(new Error(`Error fetching issues by project: ${this.handleFetchIssuesError(error)}`))
        })
    })
  }

  async fetchIssues(response: AxiosResponse, isAgile: boolean): Promise<Issue[]> {
    const rankCustomField = this.customFields.get("Rank") || ""
    return new Promise((resolve) => {
      const issues: Promise<Issue[]> = Promise.all(
        response.data.issues.map(async (element: JiraIssue) => ({
          issueKey: element.key,
          summary: element.fields.summary,
          creator: element.fields.creator.displayName,
          status: element.fields.status.name,
          type: element.fields.issuetype.name,
          storyPointsEstimate: await this.getIssueStoryPointsEstimate(element.key),
          epic: {
            issueKey: element.fields.parent?.key,
            summary: element.fields.parent?.fields.summary,
          },
          labels: element.fields.labels,
          assignee: {
            displayName: element.fields.assignee?.displayName,
            avatarUrls: element.fields.assignee?.avatarUrls,
          },
          rank: element.fields[rankCustomField],
          // IMPROVE: Remove boolean flag
          description: (isAgile ? element.fields.description : element.fields.description?.content),
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
    })
  }

  handleFetchIssuesError(error: AxiosError): Error {
    if (!error.response) {
      return error;
    }

    if (error.response.status === 404) {
      return new Error(
        `The board does not exist or the user does not have permission to view it: ${error.response.data}`
      )
    }

    return error;
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
        .then(async () => { resolve() })
        .catch((error) => {
          let specificError = error
          if (error.response) {
            if (error.response.status === 403) {
              specificError = new Error(
                `User does not have a valid licence or permissions to assign issues: ${error.response.data}`
              )
            } else if (error.response.status === 404) {
              specificError = new Error(
                `The board does not exist or the user does not have permission to view it: ${error.response.data}`
              )
            }
          }

          reject(new Error(`Error in moving this issue to the Sprint with id ${sprint}: ${specificError}`))
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
        .then(async () => { resolve() })
        .catch((error) => {
          let specificError = error
          if (error.response) {
            if (error.response.status === 403) {
              specificError = new Error(
                `User does not have a valid licence or permissions to assign issues: ${error.response.data}`
              )
            } else if (error.response.status === 404) {
              specificError = new Error(
                `The board does not exist or the user does not have permission to view it: ${error.response.data}`
              )
            }
          }

          reject(new Error(`Error in moving this issue to the backlog: ${specificError}`))
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
          if (response.status === 204) {
            resolve()
          } else if (response.status === 207) {
            // Returns the list of issues with status of rank operation.
            // see documentation: https://developer.atlassian.com/cloud/jira/software/rest/api-group-issue/#api-rest-agile-1-0-issue-rank-put-responses
            resolve()
          }
        })
        .catch((error) => {
          let specificError = error
          if (error.response) {
            if (error.response.status === 403) {
              specificError = new Error(
                `User does not have a valid licence or permissions to rank issues: ${error.response.data}`
              )
            }
          }

          reject(new Error(`Error in ranking this issue in the backlog: ${specificError}`))
        })
    })
  }

  async getIssueStoryPointsEstimate(issue: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get(`/issue/${issue}`)
        .then(async (response) => {
          const customField = this.customFields.get("Story point estimate")
          const points: number = response.data.fields[customField!]
          resolve(points)
        })
        .catch((error) => {
          let specificError = error
          if (error.response) {
            if (error.response.status === 404) {
              specificError = new Error(
                `The issue was not found or the user does not have permission to view it: ${error.response.data}`
              )
            }
          }

          reject(new Error(`Error in getting the story points for issue: ${issue}: ${specificError}`))
        })
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
              parent: { key: epic.issueKey },
              issuetype: { id: type },
              project: {
                id: projectId,
              },
              reporter: {
                id: reporter.id,
              },
              ...(priority.id && { priority }),
              ...(assignee && {
                assignee: {
                  id: assignee.id,
                }
              }),
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
          resolve(JSON.stringify(createdIssue.key))
          this.setTransition(createdIssue.id, status)
        })
        .catch((error) => {
          let specificError = error
          if (error.response) {
            if (error.response.status === 404) {
              specificError = new Error("The user does not have the necessary permissions")
            }
          }

          reject(new Error(`Error creating issue: ${specificError}`))
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
              ...(epic.issueKey && {
                parent: { key: epic.issueKey },
              }),
              ...(type && {
                issuetype: { id: type },
              }),
              ...(projectId && {
                project: {
                  id: projectId,
                },
              }),
              ...(reporter && { reporter }),
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
        .then(async () => { resolve() })
        .catch((error) => {
          let specificError = error
          if (error.response) {
            if (error.response.status === 404) {
              specificError = new Error(
                "The issue was not found or the user does not have the necessary permissions"
              )
            }
          }

          reject(new Error(`Error editing issue: ${specificError}`))
        })
    })
  }

  async setTransition(issueKey: string, status: string): Promise<void> {
    const transitions = new Map<string, string>()
    const transitionResponse = await this.getRestApiClient(3).get(
      `/issue/${issueKey}/transitions`,
    )

    const {data} = transitionResponse

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
          const epics: Promise<Issue[]> = Promise.all(
            response.data.issues.map(async (element: JiraIssue) => ({
              issueKey: element.key,
              summary: element.fields.summary,
              epic: element.fields.epic,
              labels: element.fields.labels,
              assignee: {
                displayName: element.fields.assignee?.displayName,
                avatarUrls: element.fields.assignee?.avatarUrls,
              },
              subtasks: element.fields.subtasks,
              created: element.fields.created,
              updated: element.fields.updated,
              comment: element.fields.comment ?? {
                comments: [],
              },
              projectId: element.fields.project.id,
              sprint: element.fields.sprint,
              attachments: element.fields.attachment,
            }))
          )
          resolve(epics)
        })
        .catch((error) => {
          let specificError = error
          if (error.response) {
            if (error.response.status === 404) {
              specificError = new Error(
                `The board does not exist or the user does not have permission to view it: ${error.response.data}`
              )
            }
          }

          reject(new Error(`Error in fetching the epics for the project ${projectIdOrKey}: ${specificError}`))
        })
    })
  }

  async getLabels(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get('/label')
        .then(async (response) => {
          resolve(response.data.values)
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
          resolve(priorityData.values)
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
        .then(async () => { resolve() })
        .catch((error) => {
          let specificError = error
          if (error.response) {
            if (error.response.status === 404) {
              specificError = new Error("The issue was not found or the user does not have the necessary permissions")
            }
          }

          reject(new Error(`Error adding a comment to the issue ${issueIdOrKey}: ${specificError}`))
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
        .then(async () => { resolve() })
        .catch((error) => {
          let specificError = error
          if (error.response) {
            if (error.response.status === 400) {
              specificError = new Error("The user does not have permission to edit the comment or the request is invalid")
            } else if (error.response.status === 404) {
              specificError = new Error("The issue was not found or the user does not have the necessary permissions")
            }
          }

          reject(new Error(`Error editing the comment in issue ${issueIdOrKey}: ${specificError}`))
        })
    })
  }

  deleteIssueComment(issueIdOrKey: string, commentId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .delete(`/issue/${issueIdOrKey}/comment/${commentId}`)
        .then(async () => { resolve() })
        .catch((error) => {
          let specificError = error
          if (error.response) {
            if (error.response.status === 400) {
              specificError = new Error("The user does not have permission to delete the comment")
            } else if (error.response.status === 404) {
              specificError = new Error("The issue was not found or the user does not have the necessary permissions")
            } else if (error.response.status === 405) {
              specificError = new Error("An anonymous call has been made to the operation")
            }
          }

          reject(new Error(`Error deleting the comment in issue ${issueIdOrKey}: ${specificError}`))
        })
    })
  }

  deleteIssue(issueIdOrKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .delete(`/issue/${issueIdOrKey}`)
        .then(async () => { resolve() })
        .catch((error) => {
          let specificError = error
          if (error.response) {
            if (error.response.status === 400) {
              specificError = new Error("The issue has subtasks and deleteSubtasks is not set to true")
            } else if (error.response.status === 403) {
              specificError = new Error("The user does not have permission to delete the issue")
            } else if (error.response.status === 404) {
              specificError = new Error("The issue was not found or the user does not have the necessary permissions")
            } else if (error.response.status === 405) {
              specificError = new Error("An anonymous call has been made to the operation")
            }
          }

          reject(new Error(`Error deleting the subtask ${issueIdOrKey}: ${specificError}`))
        })
    })
  }

  createSubtask(
    parentIssueKey: string,
    subtaskSummary: string,
    projectId: string,
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
          resolve(createdSubtask)
        })
        .catch((error) => {
          reject(new Error(`Error creating subtask: ${error}`))
        })
    })
  }

  getResource(): Promise<Resource> {
    return new Promise<Resource>((resolve, reject) => {
      if (this.accessToken !== undefined) {
        // IMPROVE expose API client instead of resource
        const {defaults} = this.getRestApiClient(3)
        const result: Resource = {
          baseUrl: defaults.baseURL ?? '',
          authorization: defaults.headers.Authorization as string,
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
        .then(async () => { resolve() })
        .catch((error) => {
          let specificError = error
          if (error.response) {
            if (error.response.status === 403) {
              specificError = new Error("The user does not have the necessary permissions")
            } else if (error.response.status === 404) {
              specificError = new Error("The Board does not exist or the user does not have the necessary permissions to view it")
            }
          }

          reject(new Error(`Error creating sprint: ${specificError}`))
        })
    })
  }
}
