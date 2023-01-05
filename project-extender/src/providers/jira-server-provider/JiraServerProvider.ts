/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import JiraApi from "jira-client"
import { fetch } from "cross-fetch"
import { ProviderApi, ProviderCreator } from "../base-provider"
import { IssueData, Project } from "../base-provider/schema"

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
        Key: project.key,
        Name: project.name,
        Type: project.projectTypeKey,
        Lead: project.lead.displayName,
      }))
      return projects
    }
    return Promise.reject(new Error(response.statusText))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPbis(projectToGet: string): Promise<IssueData> {
    // console.log(projectToGet)
    const testData = {
      data: [
        {
          key: "CANVAS-2",
          summary: "Setup Project",
          creator: "Enrico Chies",
          status: "Done",
        },
        {
          key: "CANVAS-8",
          summary: "Split Ansicht (Project Canvas)",
          creator: "Christian Huetter",
          status: "To Do",
        },
        {
          key: "CANVAS-19",
          summary: "Project Specifications",
          creator: "Christian Huetter",
          status: "Done",
        },
        {
          key: "CANVAS-18",
          summary: "Dokumentation",
          creator: "Christian Huetter",
          status: "To Do",
        },
      ],
    }
    return testData
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
