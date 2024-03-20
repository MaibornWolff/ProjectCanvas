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
  JiraCloudEpic,
  JiraCloudUser,
  JiraCloudIssue,
  JiraCloudIssueTypeWithStatus,
  JiraCloudPriority,
  JiraCloudProject,
  JiraCloudSprint,
} from "@canvas/types";
import { ParagraphDefinition, TextDefinition } from "@atlaskit/adf-schema";
import { IProvider } from "../base-provider";
import { getAccessToken, refreshTokens } from "./getAccessToken";

export class JiraCloudProvider implements IProvider {
  public accessToken: string | undefined;

  public refreshToken: string | undefined;

  private cloudID = "";

  private customFields = new Map<string, string>();

  private reversedCustomFields = new Map<string, string>();

  private constructRestBasedClient(basePath: string, version: string) {
    const instance = axios.create({
      baseURL: `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/${basePath}/${version}`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const recreateAxiosError = (originalError: AxiosError, message: string) => new AxiosError(
      message,
      originalError.code,
      originalError.config,
      originalError.request,
      originalError.response,
    );

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (isAxiosError(error) && error.response) {
          switch (error.response.status) {
            case 400: return Promise.reject(
              recreateAxiosError(error, `Invalid request: ${JSON.stringify(error.response.data)}`),
            );
            case 401: return Promise.reject(
              recreateAxiosError(error, `User not authenticated: ${JSON.stringify(error.response.data)}`),
            );
            case 403: return Promise.reject(
              recreateAxiosError(error, `User does not have a valid license: ${JSON.stringify(error.response.data)}`),
            );
            case 429: return Promise.reject(
              recreateAxiosError(error, `Rate limit exceeded: ${JSON.stringify(error.response.data)}`),
            );
            default:
          }
        }

        return Promise.reject(error);
      },
    );

    return instance;
  }

  private getRestApiClient(version: number) {
    return this.constructRestBasedClient("api", version.toString());
  }

  private getAgileRestApiClient(version: string) {
    return this.constructRestBasedClient("agile", version);
  }

  offsetDate(date: Date | undefined) {
    if (!date) {
      return date;
    }
    const convertedDate = new Date(date);
    const timezoneOffset = convertedDate.getTimezoneOffset();
    return new Date(convertedDate.getTime() - timezoneOffset * 60 * 1000);
  }

  supportsProseMirrorPayloads(): Promise<boolean> {
    return Promise.resolve(true);
  }

  async login({
    oauthLoginOptions,
  }: {
    oauthLoginOptions: {
      clientId: string,
      clientSecret: string,
      redirectUri: string,
      code: string,
    },
  }) {
    if (this.accessToken === undefined) {
      const tokenObject = await getAccessToken(oauthLoginOptions);
      this.accessToken = tokenObject.accessToken;
      this.refreshToken = tokenObject.refreshToken;
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
        this.cloudID = domainData[0].id;
      });
    });
    await this.mapCustomFields();
    return this.isLoggedIn();
  }

  async isLoggedIn() {
    return new Promise<void>((resolve, reject) => {
      if (this.accessToken !== undefined) {
        resolve();
      } else {
        reject();
      }
    });
  }

  async refreshAccessToken(oauthRefreshOptions: {
    clientId: string,
    clientSecret: string,
  }): Promise<void> {
    if (this.refreshToken) {
      const { clientId, clientSecret } = oauthRefreshOptions;
      try {
        const { accessToken, refreshToken } = await refreshTokens({
          clientId,
          clientSecret,
          _refreshToken: this.refreshToken,
        });
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        return await Promise.resolve();
      } catch (error) {
        return Promise.reject(
          new Error(`Error refreshing the access token: ${error}`),
        );
      }
    }
    return Promise.reject(new Error("Error refreshing the access token"));
  }

  logout(): Promise<void> {
    return new Promise((resolve) => {
      this.accessToken = undefined;
      this.refreshToken = undefined;
      resolve();
    });
  }

  async mapCustomFields(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get("/field")
        .then(async (response: AxiosResponse<{ name: string, id: string }[]>) => {
          response.data.forEach((field) => {
            this.customFields.set(field.name, field.id);
            this.reversedCustomFields.set(field.id, field.name);
          });
          resolve();
        })
        .catch((error) => reject(new Error(`Error mapping custom fields: ${error}`)));
    });
  }

  async getProjects(): Promise<Project[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get("/project/search?expand=description,lead,issueTypes,url,projectKeys,permissions,insight")
        .then(async (response: AxiosResponse<{ values: JiraCloudProject[] }>) => {
          resolve(response.data.values.map((project) => ({
            id: project.id.toString(),
            key: project.key,
            name: project.name,
            lead: project.lead.displayName,
            type: project.projectTypeKey,
          })));
        })
        .catch((error) => {
          switch (error.response?.status) {
            case 404: throw new Error(`No projects matching the search criteria were found: ${error.response.data}`);
            default: throw error;
          }
        })
        .catch((error) => reject(new Error(`Could not fetch projects: ${error}`)));
    });
  }

  async getIssueTypesByProject(projectIdOrKey: string): Promise<IssueType[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get(`/project/${projectIdOrKey}/statuses`)
        .then(async (response: AxiosResponse<JiraCloudIssueTypeWithStatus[]>) => resolve(response.data))
        .catch((error) => {
          switch (error.response?.status) {
            case 404: throw new Error(`The project was not found or the user does not have permission to view it: ${error.response.data}`);
            default: throw error;
          }
        })
        .catch((error) => reject(new Error(`Could not fetch issue types: ${error}`)));
    });
  }

  async getIssueTypesWithFieldsMap(): Promise<{ [key: string]: string[] }> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get("/issue/createmeta?expand=projects.issuetypes.fields")
        .then(async (response) => {
          const issueTypeToFieldsMap: { [key: string]: string[] } = {};
          response.data.projects.forEach(
            (project: {
              id: string,
              issuetypes: {
                fields: {},
                id: string,
              }[],
            }) => {
              project.issuetypes.forEach((issueType) => {
                const fieldKeys = Object.keys(issueType.fields);
                issueTypeToFieldsMap[issueType.id] = fieldKeys.map(
                  (fieldKey) => this.reversedCustomFields.get(fieldKey)!,
                );
              });
            },
          );
          resolve(issueTypeToFieldsMap);
        })
        .catch((error) => reject(new Error(`Error in fetching the issue types map: ${error}`)));
    });
  }

  async getEditableIssueFields(issueIdOrKey: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get(`/issue/${issueIdOrKey}/editmeta`)
        .then(async (response) => {
          const fieldKeys = Object.keys(response.data.fields).map(
            (fieldKey) => this.reversedCustomFields.get(fieldKey)!,
          );
          resolve(fieldKeys);
        })
        .catch((error) => reject(new Error(`Error in fetching the issue types map: ${error}`)));
    });
  }

  async getAssignableUsersByProject(projectIdOrKey: string): Promise<User[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get(`/user/assignable/search?project=${projectIdOrKey}`)
        .then(async (response: AxiosResponse<JiraCloudUser[]>) => {
          resolve(response.data.map((cloudUser): User => ({
            id: cloudUser.accountId,
            avatarUrls: cloudUser.avatarUrls,
            displayName: cloudUser.displayName,
            emailAddress: cloudUser.emailAddress,
          })));
        })
        .catch((error) => {
          switch (error.response?.status) {
            case 404: throw new Error(`Project, issue, or transition were not found: ${error.response.data}`);
            default: throw error;
          }
        })
        .catch((error) => reject(new Error(`Error in fetching the assignable users for the project ${projectIdOrKey}: ${error}`)));
    });
  }

  async getCurrentUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get("/myself")
        .then(async (response: AxiosResponse<JiraCloudUser>) => resolve({
          id: response.data.accountId,
          avatarUrls: response.data.avatarUrls,
          displayName: response.data.displayName,
          emailAddress: response.data.emailAddress,
        }))
        .catch((error) => reject(new Error(`Error in fetching the current user: ${error}`)));
    });
  }

  async getIssueReporter(issueIdOrKey: string): Promise<User> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get(`/issue/${issueIdOrKey}?fields=reporter`)
        .then((response: AxiosResponse<JiraCloudIssue>) => resolve(this.mapUser(response.data.fields.reporter)))
        .catch((error) => {
          switch (error.response?.status) {
            case 404: throw new Error(`The issue was not found or the user does not have permission to view it: ${error.response.data}`);
            default: throw error;
          }
        })
        .catch((error) => reject(new Error(`Error in fetching the issue reporter for ${issueIdOrKey}: ${error}`)));
    });
  }

  async getBoardIds(project: string): Promise<number[]> {
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient("1.0")
        .get(`/board?projectKeyOrId=${project}`)
        .then(async (response: AxiosResponse<{ values: { id: number, name: string }[] }>) => {
          resolve(response.data.values.map((element) => element.id));
        })
        .catch((error) => reject(new Error(`Could not fetch board ids: ${error}`)));
    });
  }

  async getSprints(boardId: number): Promise<Sprint[]> {
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient("1.0")
        .get(`/board/${boardId}/sprint`)
        .then(async (response: AxiosResponse<{ values: JiraCloudSprint[] }>) => {
          const sprints = response.data.values
            .filter((element) => element.state !== "closed")
            .map((element) => {
              const sDate = new Date(element.startDate);
              const eDate = new Date(element.endDate);
              return {
                id: element.id,
                name: element.name,
                state: element.state,
                startDate: Number.isNaN(sDate.getTime()) ? "Invalid Date" : dateTimeFormat.format(sDate),
                endDate: Number.isNaN(eDate.getTime()) ? "Invalid Date" : dateTimeFormat.format(eDate),
              };
            });
          resolve(sprints);
        })
        .catch((error) => {
          switch (error.response?.status) {
            case 404: throw new Error(`The board does not exist or the user does not have permission to view it: ${error.response.data}`);
            default: throw error;
          }
        })
        .catch((error) => reject(new Error(`Error fetching the sprints: ${error}`)));
    });
  }

  async getIssue(issueKey: string): Promise<Issue> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get(`/issue/${issueKey}?fields=*all`)
        .then((response: AxiosResponse<JiraCloudIssue>) => resolve(this.mapIssue(response.data)))
        .catch((error) => reject(new Error(`Could not fetch single issue ${issueKey}: ${this.handleFetchIssuesError(error)}`)));
    });
  }

  async getIssuesByProject(project: string): Promise<Issue[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get(`/search?jql=project=${project}&maxResults=10000&fields=*all&expand=changelog`)
        .then((response: AxiosResponse<{ issues: JiraCloudIssue[] }>) => resolve(this.mapIssues(response.data.issues)))
        .catch((error) => reject(new Error(`Could not fetch issues by project: ${this.handleFetchIssuesError(error)}`)));
    });
  }

  async getIssuesBySprint(sprintId: number): Promise<Issue[]> {
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient("1.0")
        .get(`/sprint/${sprintId}/issue`)
        .then((response: AxiosResponse<{ issues: JiraCloudIssue[] }>) => resolve(this.mapIssues(response.data.issues)))
        .catch((error) => reject(new Error(`Could not fetch issues by sprint: ${this.handleFetchIssuesError(error)}`)));
    });
  }

  async getBacklogIssuesByProjectAndBoard(project: string, boardId: number): Promise<Issue[]> {
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient("1.0")
        .get(`/board/${boardId}/backlog?jql=project=${project}&maxResults=500`)
        .then((response: AxiosResponse<{ issues: JiraCloudIssue[] }>) => resolve(this.mapIssues(response.data.issues)))
        .catch((error) => reject(new Error(`Could not fetch issues by project and board: ${this.handleFetchIssuesError(error)}`)));
    });
  }

  async mapIssues(issues: JiraCloudIssue[]): Promise<Issue[]> {
    return Promise.all(issues.map(this.mapIssue.bind(this)));
  }

  async mapIssue(cloudIssue: JiraCloudIssue): Promise<Issue> {
    const rankCustomField = this.customFields.get("Rank") || "";
    const sDate = cloudIssue.fields[this.customFields.get("Start date")!] as string | undefined;
    const dDate = cloudIssue.fields[this.customFields.get("Due date")!] as string | undefined;

    return {
      issueKey: cloudIssue.key,
      summary: cloudIssue.fields.summary,
      creator: cloudIssue.fields.creator.displayName,
      status: cloudIssue.fields.status.name,
      type: cloudIssue.fields.issuetype.name,
      storyPointsEstimate: await this.getIssueStoryPointsEstimate(cloudIssue.key),
      epic: {
        issueKey: cloudIssue.fields.parent?.key,
        summary: cloudIssue.fields.parent?.fields.summary,
      },
      labels: cloudIssue.fields.labels,
      assignee: cloudIssue.fields.assignee ? await this.mapUser(cloudIssue.fields.assignee) : undefined,
      reporter: await this.mapUser(cloudIssue.fields.reporter),
      rank: cloudIssue.fields[rankCustomField] as string,
      description: cloudIssue.fields.description,
      subtasks: cloudIssue.fields.subtasks,
      created: cloudIssue.fields.created,
      updated: cloudIssue.fields.updated,
      comment: {
        comments: await Promise.all(cloudIssue.fields.comment.comments.map(async (commentElement) => ({
          id: commentElement.id,
          body: typeof commentElement.body === "string"
            ? commentElement.body
            : ((commentElement.body.content[0] as ParagraphDefinition).content?.[0] as TextDefinition).text,
          author: await this.mapUser(commentElement.author),
          created: commentElement.created,
          updated: commentElement.updated,
        }))),
      },
      projectKey: cloudIssue.fields.project.key,
      sprint: cloudIssue.fields.sprint,
      attachments: cloudIssue.fields.attachment ?? [],
      changelog: cloudIssue.changelog ? {
        histories: await Promise.all(cloudIssue.changelog.histories.map(async (historyElement) => ({
          id: historyElement.id,
          items: historyElement.items,
          author: await this.mapUser(historyElement.author),
          created: historyElement.created,
        }))),
      } : undefined,
      priority: cloudIssue.fields.priority,
      startDate: sDate ? new Date(sDate) : undefined,
      dueDate: dDate ? new Date(dDate) : undefined,
    };
  }

  async mapUser(cloudUser: JiraCloudUser): Promise<User> {
    return {
      id: cloudUser.accountId,
      avatarUrls: cloudUser.avatarUrls,
      displayName: cloudUser.displayName,
      emailAddress: cloudUser.emailAddress,
    };
  }

  handleFetchIssuesError(error: AxiosError): Error {
    if (!error.response || error.response.status !== 404) {
      return error;
    }

    return new Error(`The board does not exist or the user does not have permission to view it: ${error.response.data}`);
  }

  async moveIssueToSprintAndRank(sprint: number, issue: string, rankBefore: string, rankAfter: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient("1.0")
        .post(`/sprint/${sprint}/issue`, {
          rankCustomFieldId: this.customFields.get("Rank")!.match(/_(\d+)/)![1],
          issues: [issue],
          ...(rankAfter ? { rankAfterIssue: rankAfter } : {}),
          ...(rankBefore ? { rankBeforeIssue: rankBefore } : {}),
        })
        .then(() => resolve)
        .catch((error) => {
          switch (error.response?.status) {
            case 403: throw new Error("User does not have a valid license or permissions to assign issues.");
            case 404: throw new Error("The board does not exist or the user does not have permission to view it.");
            default: throw error;
          }
        })
        .catch((error) => reject(new Error(`Error in moving this issue to the Sprint with id ${sprint}: ${error}`)));
    });
  }

  async moveIssueToBacklog(issue: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient("1.0")
        .post("/backlog/issue", { issues: [issue] })
        .then(() => resolve)
        .catch((error) => {
          switch (error.response?.status) {
            case 403: throw new Error("User does not have a valid license or permissions to assign issues.");
            case 404: throw new Error("The board does not exist or the user does not have permission to view it.");
            default: throw error;
          }
        })
        .catch((error) => reject(new Error(`Error in moving this issue to the backlog: ${error}`)));
    });
  }

  async rankIssueInBacklog(issue: string, rankBefore: string, rankAfter: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!rankBefore && !rankAfter) resolve();
      const rankCustomField = this.customFields.get("Rank");
      const body: {
        rankCustomFieldId: string,
        issues: string[],
        rankBeforeIssue?: string,
        rankAfterIssue?: string,
      } = {
        rankCustomFieldId: rankCustomField!.match(/_(\d+)/)![1],
        issues: [issue],
      };
      if (rankBefore) {
        body.rankBeforeIssue = rankBefore;
      } else if (rankAfter) {
        body.rankAfterIssue = rankAfter;
      }

      this.getAgileRestApiClient("1.0")
        .put("/issue/rank", body)
        .then(() => resolve())
        .catch((error) => {
          switch (error.response?.status) {
            case 403: throw new Error("User does not have a valid license or permissions to rank issues.");
            default: throw error;
          }
        })
        .catch((error) => reject(new Error(`Error in ranking this issue in the backlog: ${error}`)));
    });
  }

  async getIssueStoryPointsEstimate(issue: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get(`/issue/${issue}`)
        .then((response: AxiosResponse<JiraCloudIssue>) => {
          resolve(response.data.fields[this.customFields.get("Story point estimate")!] as number);
        })
        .catch((error) => {
          switch (error.response?.status) {
            case 404: throw new Error("The issue was not found or the user does not have permission to view it.");
            default: throw error;
          }
        })
        .catch((error) => reject(new Error(`Error in getting the story points for issue: ${issue}: ${error}`)));
    });
  }

  async createIssue({
    summary,
    type,
    projectKey,
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
    const offsetStartDate = this.offsetDate(startDate);
    const offsetDueDate = this.offsetDate(dueDate);

    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .post("/issue", {
          fields: {
            summary,
            parent: { key: epic.issueKey },
            issuetype: { id: type },
            project: {
              key: projectKey,
            },
            reporter: {
              id: reporter.id,
            },
            ...(priority.id && { priority }),
            ...(assignee?.id && {
              assignee: {
                id: assignee.id,
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
            ...(sprint
              && sprint.id && {
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
        })
        .then(async (response) => {
          const createdIssue = response.data;
          resolve(createdIssue.key);
          this.setTransition(createdIssue.id, status);
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            throw new Error("The user does not have the necessary permissions");
          }
          throw error;
        })
        .catch((error) => reject(new Error(`Could not create issue: ${error}`)));
    });
  }

  async editIssue(
    {
      summary,
      type,
      projectKey,
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
    issueIdOrKey: string,
  ): Promise<void> {
    const offsetStartDate = this.offsetDate(startDate);
    const offsetDueDate = this.offsetDate(dueDate);

    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .put(`/issue/${issueIdOrKey}`, {
          fields: {
            ...(summary && {
              summary,
            }),
            ...(epic
              && epic.issueKey !== undefined && {
              parent: { key: epic.issueKey },
            }),
            ...(type && {
              issuetype: { id: type },
            }),
            ...(projectKey && {
              project: {
                id: projectKey,
              },
            }),
            ...(reporter && { reporter }),
            ...(priority && priority.id && { priority }),
            ...(assignee
              && assignee.id && {
              assignee,
            }),
            ...(description && {
              description,
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
        })
        .then(async () => resolve())
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            throw new Error("The issue was not found or the user does not have the necessary permissions");
          }
          throw error;
        })
        .catch((error) => reject(new Error(`Could not edit issue: ${error}`)));
    });
  }

  async setTransition(issueKey: string, status: string): Promise<void> {
    const transitions = new Map<string, string>();
    const transitionResponse = await this.getRestApiClient(3).get(`/issue/${issueKey}/transitions`);

    transitionResponse.data.transitions.forEach((field: { name: string, id: string }) => {
      transitions.set(field.name, field.id);
    });
    const transitionId = +transitions.get(status)!;

    await this.getRestApiClient(3).post(`/issue/${issueKey}/transitions`, {
      transition: { id: transitionId },
    });
  }

  async getEpicsByProject(projectIdOrKey: string): Promise<Issue[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get(
          `search?jql=issuetype = Epic AND project = ${projectIdOrKey}&fields=*all`,
        )
        .then(async (response) => {
          const epics: Promise<Issue[]> = Promise.all(
            response.data.issues.map(async (element: JiraCloudEpic) => ({
              issueKey: element.key,
              summary: element.fields.summary,
              epic: element.fields.epic,
              labels: element.fields.labels,
              status: element.fields.status.name,
              type: element.fields.issuetype.name,
              description: element.fields.description,
              assignee: element.fields.assignee,
              subtasks: element.fields.subtasks,
              created: element.fields.created,
              updated: element.fields.updated,
              comment: {
                comments: element.fields.comment.comments.map(
                  (commentElement) => ({
                    id: commentElement.id,
                    body: typeof commentElement.body === "string"
                      ? commentElement.body
                      : ((commentElement.body.content[0] as ParagraphDefinition).content?.[0] as TextDefinition).text,
                    author: commentElement.author,
                    created: commentElement.created,
                    updated: commentElement.updated,
                  }),
                ),
              } ?? {
                comments: [],
              },
              projectId: element.fields.project.id,
              sprint: element.fields.sprint,
              attachments: element.fields.attachment,
            })),
          );
          resolve(epics);
        })
        .catch((error) => {
          switch (error.response?.status) {
            case 404: throw new Error(`The board does not exist or the user does not have permission to view it: ${error.response.data}`);
            default: throw error;
          }
        })
        .catch((error) => reject(new Error(`Could not fetch epics for project ${projectIdOrKey}: ${error}`)));
    });
  }

  async getLabels(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .get("/label")
        .then((response) => resolve(response.data.values))
        .catch((error) => reject(new Error(`Error in fetching the labels: ${error}`)));
    });
  }

  async getPriorities(): Promise<Priority[]> {
    // WARNING: currently (12.03.2023) GET /rest/api/2/priority is deprecated and GET /rest/api/2/priority/search is experimental
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get("/priority/search")
        .then(async (response: AxiosResponse<{ values: JiraCloudPriority[] }>) => resolve(response.data.values))
        .catch((error) => reject(new Error(`Could not fetch priorities: ${error}`)));
    });
  }

  async addCommentToIssue(issueIdOrKey: string, commentText: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .post(`/issue/${issueIdOrKey}/comment`, { body: commentText })
        .then(() => resolve())
        .catch((error) => {
          switch (error.response?.status) {
            case 404: throw new Error("The issue was not found or the user does not have the necessary permissions");
            default: throw error;
          }
        })
        .catch((error) => reject(new Error(`Error adding a comment to the issue ${issueIdOrKey}: ${error}`)));
    });
  }

  async editIssueComment(issueIdOrKey: string, commentId: string, commentText: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .put(`/issue/${issueIdOrKey}/comment/${commentId}`, { body: commentText })
        .then(() => resolve())
        .catch((error) => {
          switch (error.response?.status) {
            case 400: throw new Error("The user does not have permission to edit the comment or the request is invalid");
            case 404: throw new Error("The issue was not found or the user does not have the necessary permissions");
            default: throw error;
          }
        })
        .catch((error) => reject(new Error(`Error editing the comment in issue ${issueIdOrKey}: ${error}`)));
    });
  }

  deleteIssueComment(issueIdOrKey: string, commentId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .delete(`/issue/${issueIdOrKey}/comment/${commentId}`)
        .then(() => resolve())
        .catch((error) => {
          switch (error.response?.status) {
            case 400: throw new Error("The user does not have permission to delete the comment");
            case 404: throw new Error("The issue was not found or the user does not have the necessary permissions");
            case 405: throw new Error("An anonymous call has been made to the operation");
            default: throw error;
          }
        })
        .catch((error) => reject(new Error(`Error deleting the comment in issue ${issueIdOrKey}: ${error}`)));
    });
  }

  deleteIssue(issueIdOrKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .delete(`/issue/${issueIdOrKey}?deleteSubtasks=true`)
        .then(() => resolve)
        .catch((error) => {
          switch (error.response?.status) {
            case 403: throw new Error("The user does not have permission to delete the issue");
            case 404: throw new Error("The issue was not found or the user does not have the necessary permissions");
            case 405: throw new Error("An anonymous call has been made to the operation");
            default: throw error;
          }
        })
        .catch((error) => reject(new Error(`Error deleting the issue ${issueIdOrKey}: ${error}`)));
    });
  }

  createSubtask(
    parentIssueKey: string,
    subtaskSummary: string,
    projectId: string,
    subtaskIssueTypeId: string,
  ): Promise<{ id: string, key: string }> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(3)
        .post("/issue", {
          fields: {
            summary: subtaskSummary,
            issuetype: { id: subtaskIssueTypeId },
            parent: { key: parentIssueKey },
            project: { id: projectId },
          },
        })
        .then(async (response: AxiosResponse<{ id: string, key: string }>) => resolve(response.data))
        .catch((error) => reject(new Error(`Error creating subtask: ${error}`)));
    });
  }

  getResource(): Promise<Resource> {
    return new Promise<Resource>((resolve, reject) => {
      if (this.accessToken !== undefined) {
        // IMPROVE expose API client instead of resource
        const { defaults } = this.getRestApiClient(3);
        const result: Resource = {
          baseUrl: defaults.baseURL ?? "",
          authorization: defaults.headers.Authorization as string,
        };
        resolve(result);
      } else {
        reject();
      }
    });
  }

  async createSprint({
    name,
    startDate,
    endDate,
    originBoardId,
    goal,
  }: SprintCreate): Promise<void> {
    const offsetStartDate = this.offsetDate(startDate);
    const offsetEndDate = this.offsetDate(endDate);

    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient("1.0")
        .post("/sprint", {
          name,
          originBoardId,
          ...(offsetStartDate && { startDate: offsetStartDate }),
          ...(offsetEndDate && { endDate: offsetEndDate }),
          ...(goal && { goal }),
        })
        .then(() => resolve())
        .catch((error) => {
          switch (error.response?.status) {
            case 403: throw new Error("The user does not have the necessary permissions");
            case 404: throw new Error("The Board does not exist or the user does not have the necessary permissions to view it");
            default: throw error;
          }
        })
        .catch((error) => reject(new Error(`Error creating sprint: ${error}`)));
    });
  }
}
