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
      host: string
      port: string
      username: string
      password: string
    }
  }) {
    this.provider = new JiraApi(basicLoginOptions)
  }

  getProjects() {
    // const projects = this.provider?.getAllBoards().then((result) => result)
    return [{ name: "TESTSERVER", key: "SVR" }]
  }
}

export class JiraServerProviderCreator extends ProviderCreator {
  public factoryMethod(): ProviderApi {
    return new JiraServerProvider()
  }
}
