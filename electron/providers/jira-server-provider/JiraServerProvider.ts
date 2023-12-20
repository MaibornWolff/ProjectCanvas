/* eslint-disable class-methods-use-this */
import  axios, {AxiosError, AxiosResponse, isAxiosError} from "axios";
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
  Attachment,
} from "../../../types"
import {JiraEpic, JiraIssue, JiraIssueType, JiraProject, JiraSprint,} from "../../../types/jira"
import {IProvider} from "../base-provider"
import {JiraServerInfo, JiraServerUser} from "./server-types";

export class JiraServerProvider implements IProvider {
  private loginOptions = {
    url: "",
    username: "",
    password: "",
  }

  private serverInfo?: JiraServerInfo = undefined

  private customFields = new Map<string, string>()

  private reversedCustomFields = new Map<string, string>()

  private executeVersioned<R>(functionsByVersionMatcher: { [versionMatcher: string]: (...args: never[]) => R }, ...args: never[]) {
    if (!this.serverInfo) {
      throw new Error('Server info not set!')
    }

    const matches = (matcher: string): boolean => {
      let match = true
      matcher.split('.').forEach((matcherPart, index) => {
        match = match && (
            matcherPart === '*'
            || matcherPart === this.serverInfo!.versionNumbers[index].toString()
        )
      })

      return match
    }

    const isAMoreSpecificThanB = (matcherA: string, matcherB: string): boolean => {
      const matcherBParts = matcherB.split('.')
      let isMoreSpecific = false;
      matcherA.split('.').forEach((matcherAPart, index) => {
        if (matcherBParts[index] === '*' && matcherAPart !== '*') {
          isMoreSpecific = true;
        }
      })

      return isMoreSpecific;
    }

    let selectedMatcher: string | undefined
    Object.keys(functionsByVersionMatcher).forEach((matcher) => {
      if (matches(matcher) && (selectedMatcher === undefined || isAMoreSpecificThanB(matcher, selectedMatcher))) {
        selectedMatcher = matcher
      }
    })

    if (!selectedMatcher) {
      throw new Error(`No version matcher found for version: ${this.serverInfo.version}`)
    }

    return functionsByVersionMatcher[selectedMatcher](...args)
  }

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

  private getRestApiClient(version: string|number) {
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

    await this.getServerInfo()
    await this.mapCustomFields()
    return this.isLoggedIn()
  }

  async getServerInfo(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get('/serverInfo')
        .then((response: AxiosResponse<JiraServerInfo>) => {
          this.serverInfo = response.data
          if (this.serverInfo.versionNumbers[0] < 7) {
            reject(new Error(
              `Your Jira server version is unsupported. Minimum major version: 7. Your version: ${this.serverInfo.versionNumbers[0]}`,
            ))
          }

          resolve()
        })
        .catch((error) => {
          reject(new Error(`Error in checking server info: ${error}`))
        })
    })
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
            } if (error.response.status === 404) {
              return Promise.reject(new Error("Wrong URL"))
            }
          }

          return Promise.reject(error)
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
        .get('/field')
        .then((response) => {
          response.data.forEach((field: { name: string; id: string }) => {
            this.customFields.set(field.name, field.id)
            this.reversedCustomFields.set(field.id, field.name)
          })
          resolve()
        })
        .catch((error) => {
          reject(new Error(`Error in mapping custom fields: ${error}`))
        })
    })
  }

  async getProjects(): Promise<Project[]> {
    return new Promise((resolve) => {
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
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient('1.0')
        .get(`/board/${boardId}/issue?jql=project=${project}&maxResults=10000&fields=*all`)
        .then((response) => resolve(this.fetchIssues(response)))
        .catch((error) => reject(new Error(`Error in fetching issues: ${error}`)))
    })
  }

  async getIssuesBySprintAndProject(
    sprintId: number,
    project: string,
    boardId: number
  ): Promise<Issue[]> {
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient('1.0')
        .get(`/board/${boardId}/sprint/${sprintId}/issue?jql=project=${project}`)
        .then((response) => resolve(this.fetchIssues(response)))
        .catch((error) => reject(new Error(`Error in fetching issues: ${error}`)))
    })
  }

  async getBacklogIssuesByProjectAndBoard(
    project: string,
    boardId: number
  ): Promise<Issue[]> {
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient('1.0')
        .get(`/board/${boardId}/backlog?jql=sprint is EMPTY AND project=${project}`)
        .then((response) => resolve(this.fetchIssues(response)))
        .catch((error) => reject(new Error(`Error in fetching issues: ${error}`)))
    })
  }

  async fetchIssues(response: AxiosResponse): Promise<Issue[]> {
    const rankCustomField = this.customFields.get("Rank")

    return Promise.all(
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
        rank: element.fields[rankCustomField!],
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

  getAssignableUsersByProject(projectIdOrKey: string): Promise<User[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get(`/user/assignable/search?project=${projectIdOrKey}`)
        .then(async (response: AxiosResponse<JiraServerUser[]>) => {
          const users: User[] = response.data.map((user) => ({
            id: user.key,
            name: user.name,
            displayName: user.displayName,
            avatarUrls: user.avatarUrls,
            emailAddress: user.emailAddress,
          } as User))
          resolve(users)
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 404) {
              return Promise.reject(Error(`Project was not found: ${error.response.data}`))
            }
          }

          return Promise.reject(error)
        })
        .catch((error) => {
          reject(new Error(`Error in fetching the assignable users for the project ${projectIdOrKey}: ${error}`))
        })
    })
  }

  getCurrentUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get('/myself')
        .then(async (response: AxiosResponse<JiraServerUser>) => resolve({
          id: response.data.key,
          name: response.data.name,
          displayName: response.data.displayName,
          avatarUrls: response.data.avatarUrls,
          emailAddress: response.data.emailAddress,
        } as User))
        .catch((error) => reject(new Error(`Error in the current user: ${error}`)))
    })
  }
  /* eslint-disable @typescript-eslint/no-unused-vars */

  createIssue({
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
      this.getIssueTypesByProject(projectId)
        .then((issueTypes) => {
          const relevantIssueType = issueTypes.find((issueType) => issueType.id === type)

          this.getRestApiClient(2)
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
                    name: reporter.name,
                  },
                  ...(priority.id && { priority }),
                  ...(assignee && {
                    assignee: {
                      name: assignee.name,
                    },
                  }),
                  description,
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
                  ...(relevantIssueType && relevantIssueType.name === 'Epic' && {
                    [this.customFields.get("Epic Name")!]: summary
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
              await this.setTransition(createdIssue.id, status)
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
    })
  }

  getEpicsByProject(projectIdOrKey: string): Promise<Issue[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get(`search?jql=issuetype = Epic AND project = ${projectIdOrKey}&fields=*all`)
        .then(async (response) => {
          const epics: Promise<Issue[]> = Promise.all(
            response.data.issues.map(async (element: JiraEpic) => ({
              issueKey: element.key,
              summary: element.fields.summary,
              labels: element.fields.labels,
              projectId: element.fields.project.id,
              status: element.fields.status.name,
              type: element.fields.issuetype.name,
              created: element.fields.created,
              updated: element.fields.updated,
              description: element.fields.description.content,
              assignee: {
                displayName: element.fields.assignee?.displayName,
                avatarUrls: element.fields.assignee?.avatarUrls,
              },
              subtasks: element.fields.subtasks,
              comment: {
                comments: element.fields.comment.comments.map((commentElement) => ({
                  id: commentElement.id,
                  body: commentElement.body,
                  author: commentElement.author,
                  created: commentElement.created,
                  updated: commentElement.updated,
                })),
              },
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

  getIssuesBySprint(sprintId: number): Promise<Issue[]> {
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient('1.0')
        .get(`/sprint/${sprintId}/issue`)
        .then(async (response) => {
          resolve(this.fetchIssues(response))
        })
        .catch((error) => {
          reject(new Error(`Error fetching issues by sprint ${sprintId}: ${error}`))
        })
    })
  }

  getLabels(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get('/jql/autocompletedata/suggestions?fieldName=labels')
        .then((response: AxiosResponse<{ results: { value: string }[] }>) => {
          resolve(response.data.results.map((result) => result.value))
        })
        .catch((error) =>
          reject(new Error(`Error in fetching labels: ${JSON.stringify(error)}`))
        )
    })
  }

  getPriorities(): Promise<Priority[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get('/priority')
        .then((response) => {
          const priorityData: Priority[] = response.data
          resolve(priorityData)
        })
        .catch((error) =>
          reject(new Error(`Error in fetching priorities: ${error}`))
        )
    })
  }

  getIssueTypesWithFieldsMap(): Promise<{ [key: string]: string[] }> {
    return this.executeVersioned({
      '7.*': this.getIssueTypesWithFieldsMap_7.bind(this),
      '*': this.getIssueTypesWithFieldsMap_8and9.bind(this)
    })
  }

  getIssueTypesWithFieldsMap_7(): Promise<{ [key: string]: string[] }> {
    return new Promise((resolve) => {
      this.getRestApiClient(2)
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
    })
  }

  getIssueTypesWithFieldsMap_8and9(): Promise<{ [key: string]: string[] }> {
    return new Promise((resolve) => {
      // IMPROVE: This is barely scalable
      this.getProjects()
        .then(async (projects) => {
          const issueTypeToFieldsMap: { [key: string]: string[] } = {}
          await Promise.all(projects.map((project) =>
            // IMPROVE: This call currently only supports 50 issue types
            this.getRestApiClient(2)
              .get(`/issue/createmeta/${project.id}/issuetypes`)
              .then(async (response) => {
                await Promise.all(response.data.values.map((issueType: { id: string }) =>
                  // IMPROVE: This call currently only supports 50 issue types
                  this.getRestApiClient(2)
                    .get(`/issue/createmeta/${project.id}/issuetypes/${issueType.id}`)
                    .then((issueTypesResponse) => {
                      issueTypeToFieldsMap[issueType.id] = issueTypesResponse.data.values.map(
                        (issueTypeField: { fieldId: string }) => this.reversedCustomFields.get(issueTypeField.fieldId)!
                      )
                    })
                ))
              })
          ))

          return resolve(issueTypeToFieldsMap)
        })
    })
  }

  getResource(): Promise<Resource> {
    return new Promise<Resource>((resolve, reject) => {
      if (this.loginOptions.username !== undefined && this.loginOptions.password) {
        // IMPROVE expose API client instead of resource
        const {defaults} = this.getRestApiClient(2)
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

  createSprint({
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

  deleteIssue(issueIdOrKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .delete(`/issue/${issueIdOrKey}?deleteSubtasks`)
        .then(async () => { resolve() })
        .catch((error) => {
          let specificError = error
          if (error.response) {
            if (error.response.status === 403) {
              specificError = new Error("The user does not have permission to delete the issue")
            } else if (error.response.status === 404) {
              specificError = new Error("The issue was not found or the user does not have the necessary permissions")
            } else if (error.response.status === 405) {
              specificError = new Error("An anonymous call has been made to the operation")
            }
          }

          reject(new Error(`Error deleting the issue ${issueIdOrKey}: ${specificError}`))
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
      this.getRestApiClient(2)
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

  editIssue(
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
      this.getRestApiClient(2)
        .put(
          `/issue/${issueIdOrKey}`,
          {
            fields: {
              ...(summary && {
                summary,
              }),
              ...(epic && epic.issueKey && {
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
              ...(reporter && {
                reporter,
              }),
              ...(priority && priority.id && { priority }),
              ...(assignee && {
                assignee,
              }),
              ...(description && {
                description
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

          reject(new Error(`Error creating issue: ${specificError}`))
        })
    })
  }

  setTransition(issueIdOrKey: string, targetStatus: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get(`/issue/${issueIdOrKey}/transitions`)
        .then((response) => {
          const transitions = new Map<string, string>()
          response.data.transitions.forEach((field: { name: string; id: string }) => {
            transitions.set(field.name, field.id)
          })

          const transitionId = +transitions.get(targetStatus)!

          return this
            .getRestApiClient(2)
            .post(
            `/issue/${issueIdOrKey}/transitions`,
            { transition: { id: transitionId } }
          )
        })
        .then(() => resolve())
        .catch((error) => {
          reject(new Error(`Error setting transition: ${error}`))
        })
    })
  }

  getEditableIssueFields(issueIdOrKey: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
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

  getIssueReporter(issueIdOrKey: string): Promise<User> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
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

  addCommentToIssue(issueIdOrKey: string, commentText: string): Promise<void> {
     return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .post(
          `/issue/${issueIdOrKey}/comment`,
          { body: commentText.replace(/\n/g, " ") }
        )
        .then(() => resolve())
        .catch((error) => {
          reject(new Error(`Error adding a comment to the issue ${issueIdOrKey}: ${error}`))
        })
    })
  }

  editIssueComment(
    issueIdOrKey: string,
    commentId: string,
    commentText: string
  ): Promise<void> {
    return new Promise((resolve, reject) =>{
      // main part
      this.getRestApiClient(2)
        .put(
          `/issue/${issueIdOrKey}/comment/${commentId}`,
          { body: commentText.replace(/\n/g, " ") }
        )
        .then(() => { resolve() })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 400) {
              return Promise.reject(new Error("The user does not have permission to edit the comment or the request is invalid"))
            } if (error.response.status === 404) {
              return Promise.reject(new Error("The issue was not found or the user does not have the necessary permissions"))
            }
          }

          return Promise.reject(error)
        })
        .catch((error) => {
          reject(Error(`Error editing the comment in issue ${issueIdOrKey}: ${error}`))
        })
    })
  }

  deleteIssueComment(issueIdOrKey: string, commentId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .delete(`/issue/${issueIdOrKey}/comment/${commentId}`)
        .then(() => { resolve() })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 404) {
              return Promise.reject(new Error("The issue was not found or the user does not have the necessary permissions"))
            } if (error.response.status === 405) {
              return Promise.reject(new Error("An anonymous call has been made to the operation"))
            }
          }

          return Promise.reject(new Error(`Error deleting the comment in issue ${issueIdOrKey}: ${error}`))
        })
        .catch((error) => {
          reject(Error(`Error deleting the comment in issue ${issueIdOrKey}: ${error}`))
        })
    })
  }

  refreshAccessToken(): Promise<void> {
    throw new Error("Method not implemented for Jira Server")
  }

  offsetDate(date: Date) {
    if (!date) {
      return date
    }
    const convertedDate = new Date(date)
    const timezoneOffset = convertedDate.getTimezoneOffset()
    return new Date(convertedDate.getTime() - timezoneOffset * 60 * 1000)
  }

  uploadAttachment(issueIdOrKey: string, attachment: FormData): Promise<Attachment> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .post(
          `/issue/issue/${issueIdOrKey}/attachments`,
          attachment,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "X-Atlassian-Token": "no-check"
            }
          }
        )
        .then((response) => { resolve(response.data) })
        .catch((error) => {
          reject(Error(`Error uploading an attachment in issue ${issueIdOrKey}: ${error}`))
        })
    })
  }

  downloadAttachment(attachmentId: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get(`/attachment/content/${attachmentId}`)
        .then((response) => { resolve(response.data) })
        .catch((error) => {
          reject(Error(`Error downloading attachment ${attachmentId}: ${error}`))
        })
    })
  }

  getAttachmentThumbnail(attachmentId: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get(`/attachment/thumbnail/${attachmentId}`)
        .then((response) => { resolve(response.data) })
        .catch((error) => {
          reject(Error(`Error getting thumbnail for attachment ${attachmentId}: ${error}`))
        })
    })
  }

  deleteAttachment(attachmentId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .delete(`/attachment/${attachmentId}`)
        .then(() => { resolve() })
        .catch((error) => {
          reject(Error(`Error deleting attachment ${attachmentId}: ${error}`))
        })
    })
  }
}
