/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import fetch from "cross-fetch"
import { ProviderApi, ProviderCreator } from "../base-provider"
import { getAccessToken } from "./getAccessToken"

class JiraCloudProvider implements ProviderApi {
  accessToken: string | undefined

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
    this.accessToken = await getAccessToken(oauthLoginOptions)
  }

  getProjects() {
    return [{ name: "name", key: "JIRAUSER10100" }]
  }

  async getResources() {
    await fetch("https://api.atlassian.com/oauth/token/accessible-resources", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
    }).then(async (response) => {
      console.log(await response.json())
    })
  }
}

export class JiraCloudProviderCreator extends ProviderCreator {
  public factoryMethod(): ProviderApi {
    return new JiraCloudProvider()
  }
}