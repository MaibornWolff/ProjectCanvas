/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import JiraApi from "jira-client"
import { ProviderApi, ProviderCreator } from "./BaseProvider"

class JiraServerProvider implements ProviderApi {
  provider: JiraApi | undefined = undefined

  login(options: any) {
    this.provider = new JiraApi(options.basicLoginOptions)
  }

  getProjects() {
    return this.provider?.getAllBoards().then((result) => result)
  }
}

export class JiraServerProviderCreator extends ProviderCreator {
  public factoryMethod(): ProviderApi {
    return new JiraServerProvider()
  }
}
