import { Issue, Sprint } from "../../types"

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
  getProjects(): Promise<{ name: string; key: string }[]>
  getBoardIds(project: string): Promise<number[]>
  getSprints(BoardId: number): Promise<Sprint[]>
  getPbis(project: string): Promise<Issue[]>
  getDonePBIsForProject(project: string): Promise<Issue[]>
  getBacklogPbisForProject(project: string, boardId: number): Promise<Issue[]>
  getPbisWithoutSprints(project: string): Promise<Issue[]>
  getPbisForSprint(sprintId: number, project: string): Promise<Issue[]>
  moveIssueToSprint(sprint: number, issue: string): Promise<void>
  moveIssueToBacklog(issue: string): Promise<void>
}

export abstract class ProviderCreator {
  public abstract factoryMethod(): ProviderApi
}
