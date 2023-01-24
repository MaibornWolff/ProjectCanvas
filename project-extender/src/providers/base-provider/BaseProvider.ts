import { Issue, Sprint } from "./schema"
import { IssueBean, PageOfComments } from "../jira-cloud-provider/types"

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
  getBoardIds(projectKey: string): Promise<number[]>
  getPbisWithoutSprints(projectToGet: string): Promise<Issue[]>
  getPbisForSprint(sprintId: number, projectToGet: string): Promise<Issue[]>
  login(loginOptions: LoginOptions): Promise<void>
  isLoggedIn(): Promise<void>
  getProjects(): Promise<{ name: string; key: string }[]>
  logout(): Promise<void>
  getPbis(projectToGet: string): Promise<Issue[]>
  getIssue(issueIdOrKey: string): Promise<IssueBean>
  getIssueComments(issueIdOrKey: string): Promise<PageOfComments>
  getSprints(BoardId: number): Promise<Sprint[]>
}

export abstract class ProviderCreator {
  public abstract factoryMethod(): ProviderApi
}
