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

export class JiraCloudProvider implements IProvider {
  public accessToken: string | undefined

  public refreshToken: string | undefined

  private cloudID = ""

  private customFields = new Map<string, string>()

  private reversedCustomFields = new Map<string, string>()

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
      fetch(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/field`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )
        .then(async (data) => {
          const fetchedFields = await data.json()
          if (data.status === 200) {
            fetchedFields.forEach((field: { name: string; id: string }) => {
              this.customFields.set(field.name, field.id)
              this.reversedCustomFields.set(field.id, field.name)
            })
            resolve()
          } else if (data.status === 401) {
            reject(new Error(`User not authenticated: ${fetchedFields}`))
          } else {
            reject(new Error(`Unknown error: ${fetchedFields}`))
          }
        })
        .catch((error) => {
          reject(new Error(`Error creating issue: ${error}`))
        })
    })
  }

  async getProjects(): Promise<Project[]> {
    return new Promise((resolve, reject) => {
      fetch(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/project/search?expand=description,lead,issueTypes,url,projectKeys,permissions,insight`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )
        .then(async (response) => {
          const data = await response.json()
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
          } else if (response.status === 401) {
            reject(new Error(`User not authenticated: ${data}`))
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
          if (response.status === 200) {
            const issueTypes: JiraIssueType[] = await response.json()
            resolve(issueTypes as IssueType[])
          } else if (response.status === 401) {
            reject(
              new Error(`User not authenticated: ${await response.json()}`)
            )
          } else if (response.status === 404) {
            reject(
              new Error(
                `The project was not found or the user does not have permission to view it: ${await response.json()}`
              )
            )
          } else {
            reject(new Error(`Unknown error: ${await response.json()}`))
          }
        })
        .catch((error) =>
          reject(new Error(`Error in fetching the issue types: ${error}`))
        )
    })
  }

  async getIssueTypesWithFieldsMap(): Promise<{ [key: string]: string[] }> {
    return new Promise((resolve, reject) => {
      fetch(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/issue/createmeta?expand=projects.issuetypes.fields`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )
        .then(async (response) => {
          const metadata = await response.json()
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
                project.issuetypes.forEach((issuetype) => {
                  const fieldKeys = Object.keys(issuetype.fields)
                  issueTypeToFieldsMap[issuetype.id] = fieldKeys.map(
                    (fieldKey) => this.reversedCustomFields.get(fieldKey)!
                  )
                })
              }
            )
            resolve(issueTypeToFieldsMap)
          } else if (response.status === 401) {
            reject(new Error(`User not authenticated: ${metadata}`))
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
      fetch(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/issue/${issueIdOrKey}/editmeta`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )
        .then(async (response) => {
          const metadata = await response.json()
          if (response.status === 200) {
            const fieldKeys = Object.keys(metadata.fields).map(
              (fieldKey) => this.reversedCustomFields.get(fieldKey)!
            )
            resolve(fieldKeys)
          } else if (response.status === 401) {
            reject(new Error(`User not authenticated: ${metadata}`))
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
          if (response.status === 200) {
            const users: User[] = await response.json()
            resolve(users as User[])
          } else if (response.status === 400) {
            reject(
              new Error(`Some infos are missing: ${await response.json()}`)
            )
          } else if (response.status === 401) {
            reject(
              new Error(`User not authenticated: ${await response.json()}`)
            )
          } else if (response.status === 404) {
            reject(
              new Error(
                `Project, issue, or transition were not found: ${await response.json()}`
              )
            )
          } else if (response.status === 429) {
            reject(new Error(`Rate limit exceeded: ${await response.json()}`))
          } else {
            reject(new Error(`Unknown error: ${await response.json()}`))
          }
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

  async getCurrentUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      fetch(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/myself`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )
        .then(async (response) => {
          if (response.status === 200) {
            const user: User = await response.json()
            resolve(user as User)
          } else if (response.status === 401) {
            reject(
              new Error(`User not authenticated: ${await response.json()}`)
            )
          } else {
            reject(new Error(`Unknown error: ${await response.json()}`))
          }
        })
        .catch((error) =>
          reject(new Error(`Error in fetching the current user: ${error}`))
        )
    })
  }

  async getIssueReporter(issueIdOrKey: string): Promise<User> {
    return new Promise((resolve, reject) => {
      fetch(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/issue/${issueIdOrKey}?fields=reporter`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )
        .then(async (response) => {
          const user = await response.json()
          if (response.status === 200) {
            resolve(user.fields.reporter as User)
          } else if (response.status === 401) {
            reject(new Error(`User not authenticated: ${user}`))
          } else if (response.status === 404) {
            reject(
              new Error(
                `The issue was not found or the user does not have permission to view it: ${user}`
              )
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
      fetch(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/agile/1.0/board?projectKeyOrId=${project}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )
        .then(async (response) => {
          const data = await response.json()
          if (response.status === 200) {
            const boardIds: number[] = data.values.map(
              (element: { id: number; name: string }) => element.id
            )
            resolve(boardIds)
          } else if (response.status === 400) {
            reject(new Error(`Invalid request: ${data}`))
          } else if (response.status === 401) {
            reject(new Error(`User not authenticated: ${data}`))
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
      fetch(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/agile/1.0/board/${boardId}/sprint`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )
        .then(async (response) => {
          const data = await response.json()
          if (response.status === 200) {
            const sprints: Sprint[] = data.values
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
            reject(new Error(`Invalid request: ${data}`))
          } else if (response.status === 401) {
            reject(new Error(`User not authenticated: ${data}`))
          } else if (response.status === 403) {
            reject(new Error(`User does not have a valid licence: ${data}`))
          } else if (response.status === 404) {
            reject(
              new Error(
                `The board does not exist or the user does not have permission to view it: ${data}`
              )
            )
          } else {
            reject(new Error(`Unknown error: ${data}`))
          }
        })
        .catch((error) => {
          reject(new Error(`Error fetching the sprints: ${error}`))
        })
    })
  }

  async getIssuesByProject(project: string): Promise<Issue[]> {
    return new Promise((resolve, reject) => {
      this.fetchIssues(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/search?jql=project=${project}&maxResults=10000`
      )
        .then(async (response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(new Error(`Error fetching issues by project: ${error}`))
        })
    })
  }

  async getIssuesBySprint(sprintId: number): Promise<Issue[]> {
    return new Promise((resolve, reject) => {
      this.fetchIssues(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/agile/1.0/sprint/${sprintId}/issue`
      )
        .then(async (response) => {
          resolve(response)
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
      this.fetchIssues(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/agile/1.0/board/${boardId}/backlog?jql=project=${project}&maxResults=500`
      )
        .then(async (response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(new Error(`Error fetching issues by project: ${error}`))
        })
    })
  }

  async fetchIssues(url: string): Promise<Issue[]> {
    const rankCustomField = this.customFields.get("Rank") || ""
    return new Promise((resolve, reject) => {
      fetch(url, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
      })
        .then(async (response) => {
          const data = await response.json()
          if (response.status === 200) {
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
          } else if (response.status === 401) {
            reject(new Error(`User not authenticated: ${data}`))
          } else if (response.status === 403) {
            reject(new Error(`User does not have a valid licence: ${data}`))
          } else if (response.status === 404) {
            reject(
              new Error(
                `The board does not exist or the user does not have permission to view it: ${data}`
              )
            )
          } else {
            reject(new Error(`Unknown error: ${data}`))
          }
        })
        .catch((error) => {
          reject(new Error(`Error fetching issues: ${error}`))
        })
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
        .then(async (response) => {
          if (response.status === 204) {
            resolve()
          } else if (response.status === 400) {
            reject(new Error(`Invalid request: ${await response.json()}`))
          } else if (response.status === 401) {
            reject(
              new Error(`User not authenticated: ${await response.json()}`)
            )
          } else if (response.status === 403) {
            reject(
              new Error(
                `User does not have a valid licence or permissions to assign issues: ${await response.json()}`
              )
            )
          } else if (response.status === 404) {
            reject(
              new Error(
                `The sprint does not exist or the user does not have permission to view it: ${await response.json()}`
              )
            )
          } else {
            reject(new Error(`Unknown error: ${await response.json()}`))
          }
        })
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
        .then(async (response) => {
          if (response.status === 204) {
            resolve()
          } else if (response.status === 400) {
            reject(new Error(`Invalid request: ${await response.json()}`))
          } else if (response.status === 401) {
            reject(
              new Error(`User not authenticated: ${await response.json()}`)
            )
          } else if (response.status === 403) {
            reject(
              new Error(
                `User does not have a valid licence or permissions to assign issues: ${await response.json()}`
              )
            )
          } else if (response.status === 404) {
            reject(
              new Error(
                `The board does not exist or the user does not have permission to view it: ${await response.json()}`
              )
            )
          } else {
            reject(new Error(`Unknown error: ${await response.json()}`))
          }
        })
        .catch((error) => {
          reject(
            new Error(`Error in moving this issue to the backlog: ${error}`)
          )
        })
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
        .then(async (response) => {
          if (response.status === 204) {
            resolve()
          } else if (response.status === 207) {
            // Returns the list of issues with status of rank operation.
            // see documentation: https://developer.atlassian.com/cloud/jira/software/rest/api-group-issue/#api-rest-agile-1-0-issue-rank-put-responses
            resolve()
          } else if (response.status === 400) {
            reject(new Error(`Invalid request: ${await response.json()}`))
          } else if (response.status === 401) {
            reject(
              new Error(`User not authenticated: ${await response.json()}`)
            )
          } else if (response.status === 403) {
            reject(
              new Error(
                `User does not have a valid licence or permissions to rank issues: ${await response.json()}`
              )
            )
          } else {
            reject(new Error(`Unknown error: ${await response.json()}`))
          }
        })
        .catch((error) => {
          reject(
            new Error(`Error in moving this issue to the backlog: ${error}`)
          )
        })
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
          if (response.status === 200) {
            const customField = this.customFields.get("Story point estimate")
            const points: number = data.fields[customField!]

            resolve(points)
          } else if (response.status === 401) {
            reject(new Error(`User not authenticated: ${data}`))
          } else if (response.status === 404) {
            reject(
              new Error(
                `The issue was not found or the user does not have permission to view it: ${data}`
              )
            )
          } else {
            reject(new Error(`Unknown error: ${data}`))
          }
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
      fetch(
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
          }),
        }
      )
        .then(async (data) => {
          const createdIssue = await data.json()
          if (data.status === 201) {
            resolve(JSON.stringify(createdIssue.key))
            this.setTransition(createdIssue.id, status)
          }
          if (data.status === 400) {
            reject(new Error(createdIssue))
          }
          if (data.status === 401) {
            reject(new Error("User not authenticated"))
          }
          if (data.status === 403) {
            reject(
              new Error("The user does not have the necessary permissions")
            )
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
      fetch(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/issue/${issueIdOrKey}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
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
          }),
        }
      )
        .then(async (data) => {
          if (data.status === 204) {
            resolve()
          }
          if (data.status === 400) {
            reject(
              new Error(
                "400 Error: consult the atlassian rest api v3 under Edit issue for information"
              )
            )
          }
          if (data.status === 401) {
            reject(new Error("User not authenticated"))
          }
          if (data.status === 403) {
            reject(
              new Error("The user does not have the necessary permissions")
            )
          }
          if (data.status === 404) {
            reject(
              new Error(
                "The issue was not found or the user does not have the necessary permissions"
              )
            )
          }
        })
        .catch(async (error) => {
          reject(new Error(`Error creating issue: ${error}`))
        })
    })
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

  async getEpicsByProject(projectIdOrKey: string): Promise<Issue[]> {
    return new Promise((resolve, reject) => {
      fetch(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/search?jql=issuetype = Epic AND project = ${projectIdOrKey}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )
        .then(async (response) => {
          const epicData = await response.json()
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
          } else if (response.status === 401) {
            reject(new Error(`User not authenticated: ${epicData}`))
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
          reject(
            new Error(
              `Error in fetching the epics for the project ${projectIdOrKey}: ${error}`
            )
          )
        )
    })
  }

  async getLabels(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fetch(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/label`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )
        .then(async (response) => {
          const labelData = await response.json()
          if (response.status === 200) {
            const labels: Promise<string[]> = labelData.values

            resolve(labels)
          } else if (response.status === 401) {
            reject(new Error(`User not authenticated: ${labelData}`))
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
      fetch(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/priority/search`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )
        .then(async (response) => {
          if (response.status === 200) {
            const priorityData: JiraPriority = await response.json()
            const priorities: Priority[] = priorityData.values
            resolve(priorities)
          } else if (response.status === 401) {
            reject(
              new Error(`User not authenticated: ${await response.json()}`)
            )
          } else {
            reject(new Error(`Unknown error: ${await response.json()}`))
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
    const bodyData = `{
      "body": {
      "content": [
          {
            "content": [
              {
                "text": "${commentText.replace(/\n/g, " ")}",
                "type": "text"
              }
            ],
            "type": "paragraph"
          }
        ],
        "type": "doc",
        "version": 1
      }}`

    return new Promise((resolve, reject) => {
      fetch(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/issue/${issueIdOrKey}/comment`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: bodyData,
        }
      )
        .then(async (data) => {
          if (data.status === 201) {
            resolve()
          }
          if (data.status === 400) {
            reject(new Error("Invalid api request"))
          }
          if (data.status === 401) {
            reject(new Error("User not authenticated"))
          }
          if (data.status === 404) {
            reject(
              new Error(
                "The issue  was not found or the user does not have the necessary permissions"
              )
            )
          }
        })
        .catch(async (error) => {
          reject(
            new Error(
              `Error adding a comment to the issue ${issueIdOrKey}: ${error}`
            )
          )
        })
    })
  }

  async editIssueComment(
    issueIdOrKey: string,
    commentId: string,
    commentText: string
  ): Promise<void> {
    const bodyData = `{
      "body": {
      "content": [
          {
            "content": [
              {
                "text": "${commentText.replace(/\n/g, " ")}",
                "type": "text"
              }
            ],
            "type": "paragraph"
          }
        ],
        "type": "doc",
        "version": 1
      }}`

    return new Promise((resolve, reject) => {
      fetch(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/issue/${issueIdOrKey}/comment/${commentId}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: bodyData,
        }
      )
        .then(async (data) => {
          if (data.status === 200) {
            resolve()
          }
          if (data.status === 400) {
            reject(
              new Error(
                "The user does not have permission to edit the comment or the request is invalid"
              )
            )
          }
          if (data.status === 401) {
            reject(new Error("User not authenticated"))
          }
          if (data.status === 404) {
            reject(
              new Error(
                "The issue  was not found or the user does not have the necessary permissions"
              )
            )
          }
        })
        .catch(async (error) => {
          reject(
            new Error(
              `Error editing the comment in issue ${issueIdOrKey}: ${error}`
            )
          )
        })
    })
  }

  deleteIssueComment(issueIdOrKey: string, commentId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fetch(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/issue/${issueIdOrKey}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )
        .then(async (data) => {
          if (data.status === 204) {
            resolve()
          }
          if (data.status === 400) {
            reject(
              new Error(
                "The user does not have permission to delete the comment"
              )
            )
          }
          if (data.status === 401) {
            reject(new Error("User not authenticated"))
          }
          if (data.status === 404) {
            reject(
              new Error(
                "The issue  was not found or the user does not have the necessary permissions"
              )
            )
          }
          if (data.status === 405) {
            reject(
              new Error("An anonymous call has been made to the operation")
            )
          }
        })
        .catch(async (error) => {
          reject(
            new Error(
              `Error editing the comment in issue ${issueIdOrKey}: ${error}`
            )
          )
        })
    })
  }

  deleteIssue(issueIdOrKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fetch(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/2/issue/${issueIdOrKey}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )
        .then(async (data) => {
          if (data.status === 204) {
            resolve()
          }
          if (data.status === 400) {
            reject(
              new Error(
                "The issue has subtasks and deleteSubtasks is not set to true"
              )
            )
          }
          if (data.status === 401) {
            reject(new Error("User not authenticated"))
          }
          if (data.status === 403) {
            reject(
              new Error("The user does not have permission to delete the issue")
            )
          }
          if (data.status === 404) {
            reject(
              new Error(
                "The issue  was not found or the user does not have the necessary permissions"
              )
            )
          }
          if (data.status === 405) {
            reject(
              new Error("An anonymous call has been made to the operation")
            )
          }
        })
        .catch(async (error) => {
          reject(
            new Error(`Error deleting the  subtask ${issueIdOrKey}: ${error}`)
          )
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
      fetch(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/issue/`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
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
          }),
        }
      )
        .then(async (data) => {
          if (data.status === 201) {
            const createdSubtask: { id: string; key: string } =
              await data.json()
            resolve(createdSubtask)
          } else if (data.status === 400) {
            reject(new Error(`Invalid request: ${await data.json()}`))
          } else if (data.status === 401) {
            reject(new Error(`User not authenticated: ${await data.json()}`))
          } else if (data.status === 403) {
            reject(
              new Error(
                `User does not have a valid licence: ${await data.json()}`
              )
            )
          } else {
            reject(new Error(`Unknown error: ${await data.json()}`))
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
      fetch(
        `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/agile/1.0/sprint`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            originBoardId,
            ...(offsetStartDate && {
              startDate: offsetStartDate,
            }),
            ...(offsetEndDate && {
              endDate: offsetEndDate,
            }),
            ...(goal && { goal }),
          }),
        }
      )
        .then(async (data) => {
          if (data.status === 201) {
            resolve()
          }
          if (data.status === 400) {
            reject(new Error("Invalid request"))
          }
          if (data.status === 401) {
            reject(new Error("User not authenticated"))
          }
          if (data.status === 403) {
            reject(
              new Error("The user does not have the necessary permissions")
            )
          }
          if (data.status === 404) {
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
