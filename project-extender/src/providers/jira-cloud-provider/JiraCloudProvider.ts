/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import fetch from "cross-fetch"
import { ProviderApi, ProviderCreator } from "../base-provider"
import { Project } from "../base-provider/schema"
import { getAccessToken } from "./getAccessToken"

class JiraCloudProvider implements ProviderApi {
  logout(): Promise<void> {
    throw new Error("Method not implemented.")
  }

  static accessToken: string | undefined

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
    if (JiraCloudProvider.accessToken === undefined)
      JiraCloudProvider.accessToken = await getAccessToken(oauthLoginOptions)

    await fetch("https://api.atlassian.com/oauth/token/accessible-resources", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${JiraCloudProvider.accessToken}`,
      },
    }).then(async (response) => {
      await response.json().then(async (data) => {
        this.cloudID = data[0].id
      })
    })
    return this.isLoggedIn()
  }

  async isLoggedIn() {
    // TODO: Make sure that it is valid too
    return new Promise<void>((resolve, reject) => {
      if (JiraCloudProvider.accessToken !== undefined) {
        resolve()
      } else {
        reject()
      }
    })
  }

  async getProjects() {
    const response = await fetch(
      `https://api.atlassian.com/ex/jira/${this.cloudID}/rest/api/3/project/search?expand=description,lead,issueTypes,url,projectKeys,permissions,insight`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${JiraCloudProvider.accessToken}`,
        },
      }
    )
    const data = await response.json()
    const projects = data.values.map((project: Project) => {
      const { displayName } = project.lead

      return {
        Key: project.key,
        Name: project.name,
        Lead: displayName,
        Type: project.projectTypeKey,
      }
    })

    return projects
  }
}

export class JiraCloudProviderCreator extends ProviderCreator {
  public factoryMethod(): ProviderApi {
    return new JiraCloudProvider()
  }
}
