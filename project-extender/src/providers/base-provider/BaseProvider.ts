import { IssueData } from "./schema"

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
  getProjects(): Promise<{ name: string; key: string }[]>
  getPbis(projectToGet: string): Promise<IssueData>
}

export abstract class ProviderCreator {
  public abstract factoryMethod(requestBody: {
    url: string
    username: string
    password: string
  }): ProviderApi
}
