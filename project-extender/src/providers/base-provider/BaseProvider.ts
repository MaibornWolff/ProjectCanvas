/* eslint-disable max-classes-per-file */
import { Issue, IssueType, Priority, Project, Sprint, User } from "../../types"

export interface BasicLoginOptions {
  url: string
  username: string
  password: string
}
export interface OauthLoginOptions {
  clientId: string
  clientSecret: string
  redirectUri: string
  code: string
}
interface LoginOptions {
  basicLoginOptions?: BasicLoginOptions
  oauthLoginOptions?: OauthLoginOptions
}

export interface ProviderApi {
  login(loginOptions: LoginOptions): Promise<void>
  isLoggedIn(): Promise<void>
  logout(): Promise<void>
  getProjects(): Promise<Project[]>
  getBoardIds(project: string): Promise<number[]>
  getSprints(BoardId: number): Promise<Sprint[]>
  getIssuesByProject(project: string, boardId: number): Promise<Issue[]>
  getIssueTypesByProject(projectKeyOrId: string): Promise<IssueType[]>
  getAssignableUsersByProject(projectIdOrKey: string): Promise<User[]>
  getCurrentUser(): Promise<User>
  getBacklogIssuesByProjectAndBoard(
    project: string,
    boardId: number
  ): Promise<Issue[]>
  getIssuesBySprintAndProject(
    sprintId: number,
    project: string,
    boardId: number
  ): Promise<Issue[]>
  moveIssueToSprintAndRank(
    sprint: number,
    issue: string,
    rankBefore: string,
    rankAfter: string
  ): Promise<void>
  moveIssueToBacklog(issue: string): Promise<void>
  rankIssueInBacklog(
    issue: string,
    rankBefore: string,
    rankAfter: string
  ): Promise<void>

  createIssue(issue: Issue): Promise<string>
  getEpicsByProject(projectIdOrKey: string): Promise<Issue[]>
  getLabels(): Promise<string[]>
  getPriorities(): Promise<Priority[]>
  getIssueTypesWithFieldsMap(): Promise<Map<string, string[]>>
}

export abstract class ProviderCreator {
  public abstract factoryMethod(): ProviderApi
}
