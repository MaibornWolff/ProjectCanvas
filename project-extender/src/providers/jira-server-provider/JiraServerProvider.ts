/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import JiraApi from "jira-client"
import { fetch } from "cross-fetch"
import { ProviderApi, ProviderCreator } from "../base-provider"
import {
  Issue,
  ProjectData,
  FetchedProject,
  Sprint,
} from "../base-provider/schema"

class JiraServerProvider implements ProviderApi {
  provider: JiraApi | undefined = undefined

  private requestBody = {
    url: "",
    username: "",
    password: "",
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
    // initialize requestBody parameters
    this.requestBody.url = basicLoginOptions.url
    this.requestBody.username = basicLoginOptions.username
    this.requestBody.password = basicLoginOptions.password

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
          if (GoodResponse.status === 404) {
            reject(new Error("Wrong URL"))
          }
        })
        .catch((err) => {
          if (err.name === "FetchError") reject(new Error("Wrong URL"))
        })
    })
  }

  async getProjects(): Promise<ProjectData[]> {
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
      const projects = data.map((project: FetchedProject) => ({
        key: project.key,
        name: project.name,
        type: project.projectTypeKey,
        lead: project.lead.displayName,
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

  async getPbisWithoutSprints(projectToGet: string): Promise<Issue[]> {
    return this.fetchIssues(
      `http://${this.requestBody.url}/rest/api/2/search?jql=sprint+is+empty AND project=${projectToGet}`
    )
  }

  async getPbis(projectToGet: string): Promise<Issue[]> {
    return this.fetchIssues(
      `http://${this.requestBody.url}/rest/api/2/search?jql=project=${projectToGet}`
    )
  }

  async getPbisForSprint(
    sprintId: number,
    projectToGet: string
  ): Promise<Issue[]> {
    return this.fetchIssues(
      `http://${this.requestBody.url}/rest/api/2/search?jql=sprint=${sprintId} AND project=${projectToGet}`
    )
  }

  async fetchIssues(url: string): Promise<Issue[]> {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(
          `${this.requestBody.username}:${this.requestBody.password}`
        ).toString("base64")}`,
      },
    })

    const data = await response.json()

    const pbis: Issue[] = data.issues.map(
      (
        element: {
          key: string
          fields: {
            summary: string
            creator: { displayName: string }
            status: { name: string }
          }
        },
        index: number
      ) => ({
        pbiKey: element.key,
        summary: element.fields.summary,
        creator: element.fields.creator.displayName,
        status: element.fields.status.name,
        index,
      })
    )
    return pbis
  }

  async getSprints(boardId: number): Promise<Sprint[]> {
    const response = await fetch(
      `http://${this.requestBody.url}/rest/agile/1.0/board/${boardId}/sprint`,
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

    const data = await response.json()

    const sprints: Sprint[] = data.values.map(
      (
        element: {
          id: number
          state: string
          name: string
        },
        index: number
      ) => ({
        sprintId: element.id,
        sprintName: element.name,
        sprintType: element.state,
        index,
      })
    )
    return sprints
  }
}

export class JiraServerProviderCreator extends ProviderCreator {
  public factoryMethod(): ProviderApi {
    return new JiraServerProvider()
  }
}
