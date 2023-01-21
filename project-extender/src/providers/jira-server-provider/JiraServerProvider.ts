/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import { fetch } from "cross-fetch"
import { ProviderApi, ProviderCreator } from "../base-provider"
import { Issue, ProjectData, FetchedProject, Sprint } from "../../types"

class JiraServerProvider implements ProviderApi {
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
        .then((response) => {
          if (response.status === 200) resolve()
          if (response.status === 401) {
            reject(new Error("Wrong Username or Password"))
          }
          if (response.status === 404) {
            reject(new Error("Wrong URL"))
          }
        })
        .catch((err) => {
          if (err.name === "FetchError") reject(new Error("Wrong URL"))
        })
    })
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

  async getBoardIds(project: string): Promise<number[]> {
    const response = await fetch(
      `http://${this.requestBody.url}/rest/agile/1.0/board?projectKeyOrId=${project}`,
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

    const boardIds: number[] = data.values.map(
      (element: { id: number; name: string }) => element.id
    )
    return boardIds
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

    const sprints: Sprint[] = data.values
      .filter((element: { state: string }) => element.state !== "closed")
      .map(
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

  async getPbis(project: string): Promise<Issue[]> {
    return this.fetchIssues(
      `http://${this.requestBody.url}/rest/api/2/search?jql=project=${project}&maxResults=10000`
    )
  }

  async getPbisWithoutSprints(project: string): Promise<Issue[]> {
    return this.fetchIssues(
      `http://${this.requestBody.url}/rest/api/2/search?jql=sprint+is+empty AND project=${project}`
    )
  }

  async getPbisForSprint(sprintId: number, project: string): Promise<Issue[]> {
    return this.fetchIssues(
      `http://${this.requestBody.url}/rest/api/2/search?jql=sprint=${sprintId} AND project=${project}`
    )
  }

  async getDonePBIsForProject(project: string): Promise<Issue[]> {
    const response = await this.fetchIssues(
      `http://${this.requestBody.url}/rest/api/2/search?jql=project=${project} AND status = Done`
    )
    return response
  }

  async getBacklogPbisForProject(
    project: string,
    boardId: number
  ): Promise<Issue[]> {
    const response = await this.fetchIssues(
      `http://${this.requestBody.url}/rest/agile/1.0/board/${boardId}/backlog?jql=sprint is EMPTY AND project=${project} AND status != Done`
    )
    return response
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

  async moveIssueToSprint(sprint: number, issue: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fetch(
        `http://${this.requestBody.url}/rest/agile/1.0/sprint/${sprint}/issue`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Basic ${Buffer.from(
              `${this.requestBody.username}:${this.requestBody.password}`
            ).toString("base64")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ issues: [issue] }),
        }
      )
        .then(() => resolve())
        .catch((error) => {
          reject(
            new Error(
              `Error in moving this issue to the Sprint with id ${sprint}: ${error}`
            )
          )
        })
    })
  }

  async moveIssueToBacklog(issue: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fetch(`http://${this.requestBody.url}/rest/agile/1.0/backlog/issue`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${Buffer.from(
            `${this.requestBody.username}:${this.requestBody.password}`
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ issues: [issue] }),
      })
        .then(() => resolve())
        .catch((error) =>
          reject(
            new Error(`Error in moving this issue to the Backlog: ${error}`)
          )
        )
    })
  }
}

export class JiraServerProviderCreator extends ProviderCreator {
  public factoryMethod(): ProviderApi {
    return new JiraServerProvider()
  }
}
