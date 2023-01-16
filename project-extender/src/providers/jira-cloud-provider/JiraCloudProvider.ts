/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import fetch from "cross-fetch"
import { ProviderApi, ProviderCreator } from "../base-provider"
import { Issue, FetchedProject, Sprint } from "../base-provider/schema"
import { getAccessToken } from "./getAccessToken"

class JiraCloudProvider implements ProviderApi {
  getSpints(BoardId: number): Promise<Sprint[]> {
    console.log(BoardId)

    throw new Error("Method not implemented.")
  }

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

  async getPbis(projectToGet: string): Promise<Issue[]> {
    // const data1 = await response1.json()

    // Write the data1 object to a file named "output.json"
    // fs.writeFileSync("output.json", JSON.stringify(data1, null, 2))
    const response = await fetch(
      `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/search?jql=project=${projectToGet}&maxResults=1000`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    )
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getPbisWithoutSprints(projectId: string): Promise<Issue[]> {
    throw new Error("Method not implemented.")
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getSprints(BoardId: number): Promise<Sprint[]> {
    throw new Error("Method not implemented.")
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getPbisForSprint(sprintId: number): Promise<Issue[]> {
    throw new Error("Method not implemented.")
  }
}

export class JiraCloudProviderCreator extends ProviderCreator {
  public factoryMethod(): ProviderApi {
    return new JiraCloudProvider()
  }
}
