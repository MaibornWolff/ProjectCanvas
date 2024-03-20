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
  JiraEpic,
  JiraIssue,
  JiraIssueType,
  JiraProject,
  JiraSprint,
  JiraServerInfo,
  JiraServerUser,
} from "@canvas/types";
import { IProvider } from "../base-provider";

export class JiraServerProvider implements IProvider {
  private loginOptions = {
    url: "",
    username: "",
    password: "",
  };

  private serverInfo?: JiraServerInfo = undefined;

  private customFields = new Map<string, string>();

  private reversedCustomFields = new Map<string, string>();

  private executeVersioned<R, Args extends unknown[]>(
    functionsByVersionMatcher: {
      [versionMatcher: string]: (...args: Args) => R,
    },
    ...args: Args
  ) {
    if (!this.serverInfo) {
      throw new Error("Server info not set!");
    }

    const matches = (matcher: string): boolean => {
      let match = true;
      matcher.split(".").forEach((matcherPart, index) => {
        match = match
          && (matcherPart === "*"
            || matcherPart === this.serverInfo!.versionNumbers[index].toString());
      });

      return match;
    };

    const isAMoreSpecificThanB = (
      matcherA: string,
      matcherB: string,
    ): boolean => {
      const matcherBParts = matcherB.split(".");
      let isMoreSpecific = false;
      matcherA.split(".").forEach((matcherAPart, index) => {
        if (matcherBParts[index] === "*" && matcherAPart !== "*") {
          isMoreSpecific = true;
        }
      });

      return isMoreSpecific;
    };

    let selectedMatcher: string | undefined;
    Object.keys(functionsByVersionMatcher).forEach((matcher) => {
      if (
        matches(matcher)
        && (selectedMatcher === undefined
          || isAMoreSpecificThanB(matcher, selectedMatcher))
      ) {
        selectedMatcher = matcher;
      }
    });

    if (!selectedMatcher) {
      throw new Error(`No version matcher found for version: ${this.serverInfo.version}`);
    }

    return functionsByVersionMatcher[selectedMatcher](...args);
  }

  private getAuthHeader() {
    return `Basic ${Buffer.from(`${this.loginOptions.username}:${this.loginOptions.password}`).toString("base64")}`;
  }

  private constructRestBasedClient(apiName: string, version: string) {
    const instance = axios.create({
      baseURL: `${this.loginOptions.url}/rest/${apiName}/${version}`,
      headers: {
        Accept: "application/json",
        Authorization: this.getAuthHeader(),
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

  private getRestApiClient(version: string | number) {
    return this.constructRestBasedClient("api", version.toString());
  }

  private getAuthRestApiClient(version: number) {
    return this.constructRestBasedClient("auth", version.toString());
  }

  private getAgileRestApiClient(version: string) {
    return this.constructRestBasedClient("agile", version);
  }

  supportsProseMirrorPayloads(): Promise<boolean> {
    return Promise.resolve(false);
  }

  async login({
    basicLoginOptions,
  }: {
    basicLoginOptions: {
      url: string,
      username: string,
      password: string,
    },
  }) {
    this.loginOptions.url = basicLoginOptions.url;
    this.loginOptions.username = basicLoginOptions.username;
    this.loginOptions.password = basicLoginOptions.password;

    await this.getServerInfo();
    await this.mapCustomFields();
    return this.isLoggedIn();
  }

  private async getServerInfo(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get("/serverInfo")
        .then((response: AxiosResponse<JiraServerInfo>) => {
          this.serverInfo = response.data;
          if (this.serverInfo.versionNumbers[0] < 7) {
            reject(Error(`Your Jira server version is unsupported. Minimum major version: 7. Your version: ${this.serverInfo.versionNumbers[0]}`));
          }
          resolve();
        })
        .catch((error) => reject(Error(`Error in checking server info: ${error}`)));
    });
  }

  async isLoggedIn(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getAuthRestApiClient(1)
        .get("/session")
        .then(() => resolve())
        .catch((error) => {
          switch (error.response?.status) {
            case 401: throw Error("Wrong Username or Password");
            case 404: throw Error("Wrong URL");
            default: throw error;
          }
        })
        .catch((error) => reject(Error(`Error in checking login status: ${error}`)));
    });
  }

  async logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getAuthRestApiClient(1)
        .delete("/session")
        .then(() => resolve())
        .catch((error) => reject(new Error(`Error in logging out: ${error}`)));
    });
  }

  async mapCustomFields(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get("/field")
        .then((response) => {
          response.data.forEach((field: { name: string, id: string }) => {
            this.customFields.set(field.name, field.id);
            this.reversedCustomFields.set(field.id, field.name);
          });
          resolve();
        })
        .catch((error) => reject(Error(`Error in mapping custom fields: ${error}`)));
    });
  }

  async getProjects(): Promise<Project[]> {
    return new Promise((resolve) => {
      this.getRestApiClient(2)
        .get("/project?expand=lead,description")
        .then((response) => {
          resolve(response.data.map((project: JiraProject) => ({
            key: project.key,
            name: project.name,
            id: project.id,
            lead: project.lead.displayName,
            type: project.projectTypeKey,
          })));
        });
    });
  }

  async getIssueTypesByProject(projectIdOrKey: string): Promise<IssueType[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get(`/project/${projectIdOrKey}/statuses`)
        .then((response: AxiosResponse<JiraIssueType[]>) => {
          resolve(response.data as IssueType[]);
        })
        .catch((error) => reject(new Error(`Error in fetching the issue types: ${error}`)));
    });
  }

  async getBoardIds(project: string): Promise<number[]> {
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient("1.0")
        .get(`/board?projectKeyOrId=${project}`)
        .then((response: AxiosResponse<{ values: { id: number }[] }>) => {
          resolve(response.data.values.map((element) => element.id));
        })
        .catch((error) => reject(Error(`Error in fetching the boards: ${error}`)));
    });
  }

  async getSprints(boardId: number): Promise<Sprint[]> {
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient("1.0")
        .get(`/board/${boardId}/sprint`)
        .then(async (response: AxiosResponse<{ values: JiraSprint[] }>) => {
          const sprints: Sprint[] = response.data.values
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
        .catch((error) => reject(Error(`Error in fetching the sprints: ${error}`)));
    });
  }

  async getIssue(issueKey: string): Promise<Issue> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get(`/issue/${issueKey}?fields=*all`)
        .then((response: AxiosResponse<JiraIssue>) => resolve(this.mapIssue(response.data)))
        .catch((error) => reject(Error(`Error in fetching issue ${issueKey}: ${error}`)));
    });
  }

  async getIssuesByProject(project: string, boardId: number): Promise<Issue[]> {
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient("1.0")
        .get(`/board/${boardId}/issue?jql=project=${project}&maxResults=10000&fields=*all`)
        .then((response: AxiosResponse<{ issues: JiraIssue[] }>) => resolve(this.mapIssues(response.data.issues)))
        .catch((error) => reject(Error(`Error in fetching issues: ${error}`)));
    });
  }

  getIssuesBySprint(sprintId: number): Promise<Issue[]> {
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient("1.0")
        .get(`/sprint/${sprintId}/issue`)
        .then((response: AxiosResponse<{ issues: JiraIssue[] }>) => resolve(this.mapIssues(response.data.issues)))
        .catch((error) => reject(Error(`Error fetching issues by sprint ${sprintId}: ${error}`)));
    });
  }

  async getBacklogIssuesByProjectAndBoard(project: string, boardId: number): Promise<Issue[]> {
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient("1.0")
        .get(`/board/${boardId}/backlog?jql=sprint is EMPTY AND project=${project}`)
        .then((response: AxiosResponse<{ issues: JiraIssue[] }>) => resolve(this.mapIssues(response.data.issues)))
        .catch((error) => reject(Error(`Error in fetching issues: ${error}`)));
    });
  }

  async mapIssues(issues: JiraIssue[]): Promise<Issue[]> {
    return Promise.all(issues.map(this.mapIssue.bind(this)));
  }

  async mapIssue(jiraIssue: JiraIssue): Promise<Issue> {
    return {
      issueKey: jiraIssue.key,
      summary: jiraIssue.fields.summary,
      creator: jiraIssue.fields.creator.displayName,
      status: jiraIssue.fields.status.name,
      type: jiraIssue.fields.issuetype.name,
      storyPointsEstimate: await this.getIssueStoryPointsEstimate(jiraIssue.key),
      epic: {
        issueKey: jiraIssue.fields.parent?.key,
        summary: jiraIssue.fields.parent?.fields.summary,
      },
      labels: jiraIssue.fields.labels,
      assignee: jiraIssue.fields.assignee ? await this.mapUser(jiraIssue.fields.assignee) : undefined,
      reporter: await this.mapUser(jiraIssue.fields.reporter),
      rank: jiraIssue.fields[this.customFields.get("Rank")!] as string,
      description: jiraIssue.fields.description,
      subtasks: jiraIssue.fields.subtasks,
      created: jiraIssue.fields.created,
      updated: jiraIssue.fields.updated,
      comment: {
        comments: await Promise.all(jiraIssue.fields.comment.comments.map(async (commentElement) => ({
          id: commentElement.id,
          body: commentElement.body,
          author: await this.mapUser(commentElement.author),
          created: commentElement.created,
          updated: commentElement.updated,
        }))),
      },
      projectKey: jiraIssue.fields.project.key,
      sprint: jiraIssue.fields.sprint,
      attachments: jiraIssue.fields.attachment ?? [],
      priority: jiraIssue.fields.priority,
    };
  }

  async mapUser(user: JiraServerUser): Promise<User> {
    return {
      id: user.key,
      name: user.name,
      avatarUrls: user.avatarUrls,
      displayName: user.displayName,
      emailAddress: user.emailAddress,
    };
  }

  async moveIssueToSprintAndRank(sprint: number, issue: string, rankBefore: string, rankAfter: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient("1.0")
        .post(`/sprint/${sprint}/issue`, {
          rankCustomFieldId: this.customFields.get("Rank")!.match(/_(\d+)/)![1],
          issues: [issue],
          ...(rankAfter && { rankAfterIssue: rankAfter }),
          ...(rankBefore && { rankBeforeIssue: rankBefore }),
        })
        .then(() => resolve())
        .catch((error) => reject(Error(`Error in moving this issue to the sprint with id ${sprint}: ${error}`)));
    });
  }

  async moveIssueToBacklog(issue: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient("1.0")
        .post("/backlog/issue", { issues: [issue] })
        .then(() => resolve())
        .catch((error) => reject(Error(`Error in moving this issue to the Backlog: ${error}`)));
    });
  }

  async rankIssueInBacklog(issue: string, rankBefore: string, rankAfter: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const body: {
        rankCustomFieldId: string,
        issues: string[],
        rankBeforeIssue?: string,
        rankAfterIssue?: string,
      } = {
        rankCustomFieldId: this.customFields.get("Rank")!.match(/_(\d+)/)![1],
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
        .catch((error) => reject(Error(`Error in moving this issue to the Backlog: ${error}`)));
    });
  }

  async getIssueStoryPointsEstimate(issueKey: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get(`/issue/${issueKey}`)
        .then((response) => {
          resolve(response.data.fields[this.customFields.get("Story Points")!] as number);
        })
        .catch((error) => reject(Error(`Error in getting the story points for issue: ${issueKey}: ${error}`)));
    });
  }

  getAssignableUsersByProject(projectIdOrKey: string): Promise<User[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get(`/user/assignable/search?project=${projectIdOrKey}`)
        .then((response: AxiosResponse<JiraServerUser[]>) => {
          resolve(response.data.map(
            (user): User => ({
              id: user.key,
              name: user.name,
              displayName: user.displayName,
              avatarUrls: user.avatarUrls,
              emailAddress: user.emailAddress,
            }),
          ));
        })
        .catch((error) => {
          switch (error.response?.status) {
            case 404: throw Error("Project was not found");
            default: throw error;
          }
        })
        .catch((error) => reject(Error(`Error in fetching the assignable users for the project ${projectIdOrKey}: ${error}`)));
    });
  }

  getCurrentUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get("/myself")
        .then((response: AxiosResponse<JiraServerUser>) => resolve({
          id: response.data.key,
          name: response.data.name,
          displayName: response.data.displayName,
          avatarUrls: response.data.avatarUrls,
          emailAddress: response.data.emailAddress,
        }))
        .catch((error) => reject(new Error(`Could not fetch the current user: ${error}`)));
    });
  }

  createIssue({
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
      this.getIssueTypesByProject(projectKey).then((issueTypes) => {
        const relevantIssueType = issueTypes.find((issueType) => issueType.id === type);

        this.getRestApiClient(2)
          .post("/issue", {
            fields: {
              summary,
              parent: { key: epic.issueKey },
              issuetype: { id: type },
              project: { id: projectKey },
              reporter: { name: reporter.name },
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
              ...(sprint
                && sprint.id && {
                [this.customFields.get("Sprint")!]: +sprint.id,
              }),
              ...(storyPointsEstimate && {
                [this.customFields.get("Story point estimate")!]:
                  storyPointsEstimate,
              }),
              ...(relevantIssueType
                && relevantIssueType.name === "Epic" && {
                [this.customFields.get("Epic Name")!]: summary,
              }),
              // ...(files && {
              //   [this.customFields.get("Attachment")!]: files,
              // }),
            },
          })
          .then(async (response) => {
            const createdIssue = response.data;
            resolve(JSON.stringify(createdIssue.key));
            await this.setTransition(createdIssue.id, status);
          })
          .catch((error) => {
            switch (error.response?.status) {
              case 404: throw new Error("The user does not have the necessary permissions");
              default: throw error;
            }
          })
          .catch((error) => reject(Error(`Error creating issue: ${error}`)));
      });
    });
  }

  getEpicsByProject(projectIdOrKey: string): Promise<Issue[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get(
          `search?jql=issuetype = Epic AND project = ${projectIdOrKey}&fields=*all`,
        )
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
              description: element.fields.description,
              assignee: {
                displayName: element.fields.assignee?.displayName,
                avatarUrls: element.fields.assignee?.avatarUrls,
              },
              subtasks: element.fields.subtasks,
              comment: {
                comments: element.fields.comment.comments.map(
                  (commentElement) => ({
                    id: commentElement.id,
                    body: commentElement.body,
                    author: commentElement.author,
                    created: commentElement.created,
                    updated: commentElement.updated,
                  }),
                ),
              },
              sprint: element.fields.sprint,
              attachments: element.fields.attachment,
            })),
          );
          resolve(epics);
        })
        .catch((error) => {
          switch (error.response?.status) {
            case 404: throw new Error("The board does not exist or the user does not have permission to view it");
            default: throw error;
          }
        })
        .catch((error) => reject(Error(`Error in fetching the epics for the project ${projectIdOrKey}: ${error}`)));
    });
  }

  getLabels(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get("/jql/autocompletedata/suggestions?fieldName=labels")
        .then((response: AxiosResponse<{ results: { value: string }[] }>) => {
          resolve(response.data.results.map((result) => result.value));
        })
        .catch((error) => reject(Error(`Error in fetching labels: ${JSON.stringify(error)}`)));
    });
  }

  getPriorities(): Promise<Priority[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get("/priority")
        .then((response: AxiosResponse<Priority[]>) => resolve(response.data))
        .catch((error) => reject(new Error(`Error in fetching priorities: ${error}`)));
    });
  }

  getIssueTypesWithFieldsMap(): Promise<{ [key: string]: string[] }> {
    return this.executeVersioned({
      "7.*": this.getIssueTypesWithFieldsMap_7.bind(this),
      "*": this.getIssueTypesWithFieldsMap_8and9.bind(this),
    });
  }

  getIssueTypesWithFieldsMap_7(): Promise<{ [key: string]: string[] }> {
    return new Promise((resolve) => {
      this.getRestApiClient(2)
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
        });
    });
  }

  getIssueTypesWithFieldsMap_8and9(): Promise<{ [key: string]: string[] }> {
    return new Promise((resolve) => {
      // IMPROVE: This is barely scalable
      this.getProjects().then(async (projects) => {
        const issueTypeToFieldsMap: { [key: string]: string[] } = {};
        await Promise.all(
          // IMPROVE: This call currently only supports 50 issue types
          projects.map((project) => this.getRestApiClient(2)
            .get(`/issue/createmeta/${project.id}/issuetypes`)
            .then(async (response) => {
              await Promise.all(
                // IMPROVE: This call currently only supports 50 issue types
                response.data.values.map((issueType: { id: string }) => this.getRestApiClient(2)
                  .get(`/issue/createmeta/${project.id}/issuetypes/${issueType.id}`)
                  .then((issueTypesResponse) => {
                    issueTypeToFieldsMap[issueType.id] = issueTypesResponse.data.values.map(
                      (issueTypeField: { fieldId: string }) => this.reversedCustomFields.get(
                        issueTypeField.fieldId,
                      )!,
                    );
                  })),
              );
            })),
        );

        return resolve(issueTypeToFieldsMap);
      });
    });
  }

  getResource(): Promise<Resource> {
    return new Promise<Resource>((resolve, reject) => {
      if (
        this.loginOptions.username !== undefined
        && this.loginOptions.password
      ) {
        // IMPROVE expose API client instead of resource
        const { defaults } = this.getRestApiClient(2);
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

  createSprint({ name, startDate, endDate, originBoardId, goal }: SprintCreate): Promise<void> {
    const offsetStartDate = this.offsetDate(startDate);
    const offsetEndDate = this.offsetDate(endDate);

    return new Promise((resolve, reject) => {
      this.getAgileRestApiClient("1.0")
        .post("/sprint", {
          name,
          originBoardId,
          ...(offsetStartDate && {
            startDate: offsetStartDate,
          }),
          ...(offsetEndDate && {
            endDate: offsetEndDate,
          }),
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
        .catch((error) => reject(Error(`Error creating sprint: ${error}`)));
    });
  }

  deleteIssue(issueIdOrKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .delete(`/issue/${issueIdOrKey}?deleteSubtasks`)
        .then(() => resolve())
        .catch((error) => {
          switch (error.response?.status) {
            case 403: throw new Error("The user does not have permission to delete the issue");
            case 404: throw new Error("The issue was not found or the user does not have the necessary permissions");
            case 405: throw new Error("An anonymous call has been made to the operation");
            default: throw error;
          }
        })
        .catch((error) => reject(Error(`Error deleting the issue ${issueIdOrKey}: ${error}`)));
    });
  }

  createSubtask(
    parentIssueKey: string,
    subtaskSummary: string,
    projectId: string,
    subtaskIssueTypeId: string,
  ): Promise<{ id: string, key: string }> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .post("/issue", {
          fields: {
            summary: subtaskSummary,
            issuetype: { id: subtaskIssueTypeId },
            parent: { key: parentIssueKey },
            project: { id: projectId },
          },
        })
        .then((response: AxiosResponse<{ id: string, key: string }>) => resolve(response.data))
        .catch((error) => reject(new Error(`Error creating subtask: ${error}`)));
    });
  }

  editIssue(
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
      this.getRestApiClient(2)
        .put(`/issue/${issueIdOrKey}`, {
          fields: {
            ...(summary && { summary }),
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
            ...(assignee && { assignee }),
            ...(description && { description }),
            ...(labels && { labels }),
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
              [this.customFields.get("Story point estimate")!]: storyPointsEstimate,
            }),
          },
        })
        .then(() => resolve())
        .catch((error) => {
          switch (error.response?.status) {
            case 404: throw new Error("The issue was not found or the user does not have the necessary permissions");
            default: throw error;
          }
        })
        .catch((error) => reject(Error(`Error editing issue: ${error}`)));
    });
  }

  setTransition(issueIdOrKey: string, targetStatus: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get(`/issue/${issueIdOrKey}/transitions`)
        .then((response) => {
          const transitions = new Map<string, string>();
          response.data.transitions.forEach(
            (field: { name: string, id: string }) => {
              transitions.set(field.name, field.id);
            },
          );

          const transitionId = +transitions.get(targetStatus)!;

          return this.getRestApiClient(2).post(
            `/issue/${issueIdOrKey}/transitions`,
            { transition: { id: transitionId } },
          );
        })
        .then(() => resolve())
        .catch((error) => reject(new Error(`Error setting transition: ${error}`)));
    });
  }

  getEditableIssueFields(issueIdOrKey: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
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

  getIssueReporter(issueIdOrKey: string): Promise<User> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .get(`/issue/${issueIdOrKey}?fields=reporter`)
        .then((response) => resolve(response.data.fields.reporter))
        .catch((error) => {
          switch (error.response?.status) {
            case 404: throw new Error("The issue was not found or the user does not have permission to view it");
            default: throw error;
          }
        })
        .catch((error) => reject(Error(`Error in fetching the issue reporter: ${error}`)));
    });
  }

  addCommentToIssue(issueIdOrKey: string, commentText: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .post(`/issue/${issueIdOrKey}/comment`, {
          body: commentText.replace(/\n/g, " "),
        })
        .then(() => resolve())
        .catch((error) => reject(Error(`Error adding a comment to the issue ${issueIdOrKey}: ${error}`)));
    });
  }

  editIssueComment(issueIdOrKey: string, commentId: string, commentText: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // main part
      this.getRestApiClient(2)
        .put(`/issue/${issueIdOrKey}/comment/${commentId}`, {
          body: commentText.replace(/\n/g, " "),
        })
        .then(() => resolve())
        .catch((error) => {
          switch (error.response?.status) {
            case 400: throw new Error("The user does not have permission to edit the comment or the request is invalid");
            case 404: throw new Error("The issue was not found or the user does not have the necessary permissions");
            default: throw error;
          }
        })
        .catch((error) => reject(Error(`Error editing the comment in issue ${issueIdOrKey}: ${error}`)));
    });
  }

  deleteIssueComment(issueIdOrKey: string, commentId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRestApiClient(2)
        .delete(`/issue/${issueIdOrKey}/comment/${commentId}`)
        .then(() => resolve())
        .catch((error) => {
          switch (error.response?.status) {
            case 404: throw new Error("The issue was not found or the user does not have the necessary permissions");
            case 405: throw new Error("An anonymous call has been made to the operation");
            default: throw error;
          }
        })
        .catch((error) => reject(Error(`Error deleting the comment in issue ${issueIdOrKey}: ${error}`)));
    });
  }

  refreshAccessToken(): Promise<void> {
    throw new Error("Method not implemented for Jira Server");
  }

  offsetDate(date: Date | undefined) {
    if (!date) {
      return date;
    }
    const convertedDate = new Date(date);
    const timezoneOffset = convertedDate.getTimezoneOffset();
    return new Date(convertedDate.getTime() - timezoneOffset * 60 * 1000);
  }
}
