/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import JiraApi from "jira-client"
import { ProviderApi, ProviderCreator } from "../base-provider"

class JiraServerProvider implements ProviderApi {
  provider: JiraApi | undefined = undefined

  async login({
    basicLoginOptions,
  }: {
    basicLoginOptions: {
      url: string
      username: string
      password: string
    }
  }) {
    this.provider = new JiraApi({
      host: basicLoginOptions.url.split(":")[0],
      port: basicLoginOptions.url.split(":")[1],
      username: basicLoginOptions.username,
      password: basicLoginOptions.password,
    })

    return this.isLoggedIn()
  }

  async isLoggedIn(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.provider
        ?.getCurrentUser()
        .then(() => resolve())
        .catch(() => reject())
    })
  }

  async getProjects(): Promise<{ name: string; key: string }[]> {
    return new Promise<{ name: string; key: string }[]>((resolve, reject) => {
      this.provider
        ?.listProjects()
        .then((list) => {
          const result: { name: string; key: string }[] = []
          list?.forEach((res: JiraApi.JsonResponse) => {
            result.push({
              name: res.name,
              key: res.key,
            })
          })
          resolve(result)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

export class JiraServerProviderCreator extends ProviderCreator {
  public factoryMethod(): ProviderApi {
    return new JiraServerProvider()
  }
}
