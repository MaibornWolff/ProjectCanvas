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
} from "../../../types"
import {JiraIssue, JiraIssueType, JiraProject, JiraSprint,} from "../../../types/jira"
import {IProvider} from "../base-provider"

export class JiraServerProvider implements IProvider {
  private loginOptions = {
    url: "",
    username: "",
    password: "",
  }

  private customFields = new Map<string, string>()

  private reversedCustomFields = new Map<string, string>()

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

    await this.mapCustomFields()
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
        .get(`/board/${boardId}/issue?jql=project=${project}&maxResults=10000`)
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
        epic: element.fields.parent?.fields.summary,
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
        .then(async (response) => {
          resolve(response.data as User[])
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
        .then(async (response) => resolve(response.data as User))
        .catch((error) => reject(new Error(`Error in the current user: ${error}`)))
    })
  }
  /* eslint-disable @typescript-eslint/no-unused-vars */

  createIssue(issue: Issue): Promise<string> {
    throw new Error("Method not implemented for Jira Server")
  }

  getEpicsByProject(projectIdOrKey: string): Promise<Issue[]> {
    throw new Error("Method not implemented for Jira Server")
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
    throw new Error("Method not implemented for Jira Server")
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
    throw new Error("Method not implemented.")
  }

  createSprint(sprint: SprintCreate): Promise<void> {
    throw new Error("Method not implemented.")
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
    projectId: string,
    subtaskSummary: string,
    subtaskIssueTypeId: string
  ): Promise<{ id: string; key: string }> {
    throw new Error("Method not implemented for Jira Server")
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

  offsetDate(date: Date) {
    if (!date) {
      return date
    }
    const convertedDate = new Date(date)
    const timezoneOffset = convertedDate.getTimezoneOffset()
    return new Date(convertedDate.getTime() - timezoneOffset * 60 * 1000)
  }
}
