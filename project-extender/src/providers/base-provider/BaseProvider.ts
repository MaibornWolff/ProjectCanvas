/* eslint-disable max-classes-per-file */
import { Issue, Project, Sprint, IssueBean, PageOfComments } from "../../types"

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
  getIssuesByProject(project: string): Promise<Issue[]>
  getBacklogIssuesByProjectAndBoard(
    project: string,
    boardId: number
  ): Promise<Issue[]>
  getIssuesBySprintAndProject(
    sprintId: number,
    project: string
  ): Promise<Issue[]>
  moveIssueToSprint(sprint: number, issue: string): Promise<void>
  moveIssueToBacklog(issue: string): Promise<void>
  getIssue(issueIdOrKey: string): Promise<IssueBean>
  getIssueComments(issueIdOrKey: string): Promise<PageOfComments>
}

export abstract class ProviderCreator {
  public abstract factoryMethod(): ProviderApi
}
