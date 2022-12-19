/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import JiraApi from "jira-client"
import { ProviderApi, ProviderCreator } from "../base-provider"

class JiraServerProvider implements ProviderApi {
  provider: JiraApi | undefined = undefined

  login({
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
  }

  async getProjects() {
    const projectsData = await this.provider?.getProjects("1")
    const projects = projectsData?.values.map(
      ({ key, name }: { key: string; name: string }) => ({
        key,
        name,
      })
    )

    return projects
  }
}

export class JiraServerProviderCreator extends ProviderCreator {
  public factoryMethod(): ProviderApi {
    return new JiraServerProvider()
  }
}
