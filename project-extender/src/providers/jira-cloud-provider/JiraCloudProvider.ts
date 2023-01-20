/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import fetch from "cross-fetch"
import { ProviderApi, ProviderCreator } from "../base-provider"
import { Issue, FetchedProject, Sprint } from "../../types"
import { getAccessToken } from "./getAccessToken"

class JiraCloudProvider implements ProviderApi {
  public accessToken: string | undefined

  private cloudID = ""

  async login({
    oauthLoginOptions,
  }: {
    oauthLoginOptions: {
      clientId: string
      clientSecret: string
      redirectUri: string
      code: string
    }
  }) {
    if (this.accessToken === undefined)
      this.accessToken = await getAccessToken(oauthLoginOptions)

    await fetch("https://api.atlassian.com/oauth/token/accessible-resources", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
    }).then(async (response) => {
      await response.json().then(async (domainData) => {
        // TODO: there could be more than just a single domain accessible.
        // Possible solution: add a screen after the login for jira cloud,
        //                    where the user can choose the domain to work on
        this.cloudID = domainData[0].id
      })
    })
    return this.isLoggedIn()
  }

  async isLoggedIn() {
    return new Promise<void>((resolve, reject) => {
      if (this.accessToken !== undefined) {
        resolve()
      } else {
        reject()
      }
    })
  }

  logout(): Promise<void> {
    return new Promise((resolve) => {
      this.accessToken = undefined
      resolve()
    })
  }

  async getProjects() {
    const response = await fetch(
      `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/project/search?expand=description,lead,issueTypes,url,projectKeys,permissions,insight`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    )
    const data = await response.json()
    const projects = data.values.map((project: FetchedProject) => ({
      key: project.key,
      name: project.name,
      lead: project.lead.displayName,
      type: project.projectTypeKey,
    }))

    return projects
  }

  async getBoardIds(project: string): Promise<number[]> {
    const response = await fetch(
      `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/agile/1.0/board?projectKeyOrId=${project}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.accessToken}`,
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
      `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/agile/1.0/board/${boardId}/sprint`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.accessToken}`,
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
    const response = await this.fetchIssues(
      `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/search?jql=project=${project}&maxResults=10000`
    )
    return response
  }

  async getPbisWithoutSprints(project: string): Promise<Issue[]> {
    const response = await this.fetchIssues(
      `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/search?jql=sprint+is+empty AND project=${project}`
    )
    return response
  }

  async getPbisForSprint(sprintId: number, project: string): Promise<Issue[]> {
    const response = await this.fetchIssues(
      `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/search?jql=sprint=${sprintId} AND project=${project}`
    )
    return response
  }

  async getDonePBIsForProject(project: string): Promise<Issue[]> {
    const response = await this.fetchIssues(
      `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/search?jql=project=${project} AND status = Done`
    )
    return response
  }

  async getBacklogPbisForProject(
    project: string,
    boardId: number
  ): Promise<Issue[]> {
    const response = await this.fetchIssues(
      `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/agile/1.0/board/${boardId}/backlog?jql=sprint is EMPTY AND project=${project} AND status != Done`
    )

    return response
  }

  async fetchIssues(url: string): Promise<Issue[]> {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.accessToken}`,
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

  async moveIssueToSprint(sprint: number, issue: string): Promise<string> {
    // "rankBeforeIssue": "PR-4",
    // "rankCustomFieldId": 10521,
    const bodyData = `{
      "issues": [
        "${issue}",
      ]
    }`

    await fetch(
      `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/agile/1.0/sprint/${sprint}/issue`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: bodyData,
      }
    )
      .then((response) => response.text())
      .then((text) => text)
      .catch((err) => err)
    return "yo"
  }

  async moveIssueToBacklog(issue: string): Promise<string> {
    const bodyData = `{
      "issues": [
        "${issue}",
      ]
    }`

    await fetch(
      `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/agile/1.0/backlog/issue`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: bodyData,
      }
    )
      .then((response) => response.text())
      .then((text) => text)
      .catch((err) => err)
    return "yo"
  }
}

export class JiraCloudProviderCreator extends ProviderCreator {
  public factoryMethod(): ProviderApi {
    return new JiraCloudProvider()
  }
}
