import { Issue, Sprint } from "./schema"

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
  getPbisWithoutSprints(projectToGet: string): Promise<Issue[]>
  getPbisForSprint(sprintId: number, projectToGet: string): Promise<Issue[]>
  login(loginOptions: LoginOptions): Promise<void>
  isLoggedIn(): Promise<void>
  getProjects(): Promise<{ name: string; key: string }[]>
  logout(): Promise<void>
  getPbis(projectToGet: string): Promise<Issue[]>
  getSprints(BoardId: number): Promise<Sprint[]>
}

export abstract class ProviderCreator {
  public abstract factoryMethod(): ProviderApi
}
