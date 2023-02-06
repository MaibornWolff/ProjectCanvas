/* eslint-disable max-classes-per-file */
import { Issue, IssueType, Project, Sprint } from "../../types"

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

  createIssue(
    issueSummary: string,
    issueTypeId: string,
    projectId: string,
    reporterId: string,
    assigneeId: string,
    sprintId: number,
    storyPointsEstimate: number,
    description: string,
    status: string
  ): void
}

export abstract class ProviderCreator {
  public abstract factoryMethod(): ProviderApi
}
