interface LoginOptions {
  basicLoginOptions?: {
    host: string
    port: string
    username: string
    password: string
  }
  oauthLoginOptions?: {
    clientId: string
    clientSecret: string
    redirectUri: string
    code: string
  }
}

export interface ProviderApi {
  login(loginOptions: LoginOptions): void
  getProjects(): { name: string; key: string }[]
}

export abstract class ProviderCreator {
  public abstract factoryMethod(): ProviderApi
}
