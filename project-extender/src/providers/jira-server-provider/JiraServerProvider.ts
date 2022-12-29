/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import JiraApi from "jira-client"
import { ProviderApi, ProviderCreator } from "../base-provider"
import { Project } from "../base-provider/schema"

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

  async getProjects(): Promise<Project[]> {
    return new Promise<Project[]>((resolve, reject) => {
      this.provider
        ?.listProjects()
        .then((list) => {
          const result: Project[] = []
          list?.forEach((res: JiraApi.JsonResponse) => {
            const project: Project = {
              id: res.id,
              key: res.key,
              name: res.name,
            }
            result.push(project)
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
