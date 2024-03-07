import { Issue, IssueType, Priority, Project, Resource, Sprint, SprintCreate, User } from "@canvas/types";

export interface BasicAuthLoginOptions {
  url: string,
  username: string,
  password: string,
}

export interface OAuthLoginOptions {
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  code: string,
}

export interface OAuthRefreshOptions {
  clientId: string,
  clientSecret: string,
}

interface LoginOptions {
  basicAuthLoginOptions?: BasicAuthLoginOptions,
  oAuthLoginOptions?: OAuthLoginOptions,
}

export interface IProvider {
  login(loginOptions: LoginOptions): Promise<void>,
  isLoggedIn(): Promise<void>,
  refreshAccessToken(oauthRefreshOptions: OAuthRefreshOptions): Promise<void>,
  logout(): Promise<void>,
  getProjects(): Promise<Project[]>,
  getBoardIds(project: string): Promise<number[]>,
  getSprints(BoardId: number): Promise<Sprint[]>,
  getIssuesByProject(project: string, boardId: number): Promise<Issue[]>,
  getIssueTypesByProject(projectKeyOrId: string): Promise<IssueType[]>,
  getAssignableUsersByProject(projectIdOrKey: string): Promise<User[]>,
  getCurrentUser(): Promise<User>,
  getBacklogIssuesByProjectAndBoard(
    project: string,
    boardId: number
  ): Promise<Issue[]>,
  getIssuesBySprint(sprintId: number): Promise<Issue[]>,
  moveIssueToSprintAndRank(
    sprint: number,
    issue: string,
    rankBefore: string,
    rankAfter: string
  ): Promise<void>,
  moveIssueToBacklog(issue: string): Promise<void>,
  rankIssueInBacklog(
    issue: string,
    rankBefore: string,
    rankAfter: string
  ): Promise<void>,
  editIssue(issue: Issue, issueIdOrKey: string): Promise<void>,
  deleteIssue(issueIdOrKey: string): Promise<void>,
  createIssue(issue: Issue): Promise<string>,
  createSubtask(
    parentIssueKey: string,
    subtaskSummary: string,
    projectId: string,
    subtaskIssueTypeId: string
  ): Promise<{ id: string, key: string }>,
  getEpicsByProject(projectIdOrKey: string): Promise<Issue[]>,
  getLabels(): Promise<string[]>,
  getPriorities(): Promise<Priority[]>,
  getIssueTypesWithFieldsMap(): Promise<{ [key: string]: string[] }>,
  setTransition(issueIdOrKey: string, targetStatus: string): Promise<void>,
  getEditableIssueFields(issueIdOrKey: string): Promise<string[]>,
  getIssueReporter(issueIdOrKey: string): Promise<User>,
  addCommentToIssue(issueIdOrKey: string, commentText: string): Promise<void>,
  editIssueComment(
    issueIdOrKey: string,
    commentId: string,
    commentText: string
  ): Promise<void>,
  deleteIssueComment(issueIdOrKey: string, commentId: string): Promise<void>,
  getResource(): Promise<Resource>,
  createSprint(sprint: SprintCreate): Promise<void>,
}
