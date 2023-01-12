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
      fetch(`http://${this.requestBody.url}/rest/auth/1/session`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${Buffer.from(
            `${this.requestBody.username}:${this.requestBody.password}`
          ).toString("base64")}`,
        },
      })
        .then((GoodResponse) => {
          if (GoodResponse.status === 200) resolve()
          if (GoodResponse.status === 401) {
            reject(new Error("Wrong Username or Password"))
          }
        })
        .catch(() => {
          reject(new Error("Wrong URL"))
        })
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
        Key: project.key,
        Name: project.name,
        Type: project.projectTypeKey,
        Lead: project.lead.displayName,
      }))
      return projects
    }
    return Promise.reject(new Error(response.statusText))
  }

  async logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      fetch(`http://${this.requestBody.url}/rest/auth/1/session`, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${this.requestBody.username}:${this.requestBody.password}`
          ).toString("base64")}`,
        },
      }).then((res) => {
        if (res.status === 204) {
          resolve()
        }
        if (res.status === 401) {
          reject(new Error("user not authenticated"))
        }
      })
    })
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
