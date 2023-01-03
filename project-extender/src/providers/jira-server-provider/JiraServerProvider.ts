/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import JiraApi from "jira-client"
import { fetch } from "cross-fetch"
import { ProviderApi, ProviderCreator } from "../base-provider"
import { Project } from "../base-provider/schema"

class JiraServerProvider implements ProviderApi {
  provider: JiraApi | undefined = undefined

  private requestBody: {
    url: string
    username: string
    password: string
  }

  constructor(requestBody: {
    url: string
    username: string
    password: string
  }) {
    this.requestBody = requestBody
  }

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
    const response = await fetch(
      `http://${this.requestBody.url}/rest/api/2/project?expand=lead,description`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${Buffer.from(
            `${this.requestBody.username}:${this.requestBody.password}`
          ).toString("base64")}`,
        },
      }
    )
    if (response.ok) {
      const data = await response.json()
      const projects = data.map((project: Project) => ({
        key: project.key,
        name: project.name,
        type: project.projectTypeKey,
        lead: project.lead.displayName,
      }))
      return projects
    }
    return Promise.reject(new Error(response.statusText))
  }
}

export class JiraServerProviderCreator extends ProviderCreator {
  public factoryMethod(requestBody: {
    url: string
    username: string
    password: string
  }): ProviderApi {
    return new JiraServerProvider(requestBody)
  }
}
