/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import fetch from "cross-fetch"
import { ProviderApi, ProviderCreator } from "./BaseProvider"
import { getAccessToken } from "./getAccessToken"

class JiraCloudProvider implements ProviderApi {
  async login(options: {
    oauthLoginOptions: {
      clientId: string
      clientSecret: string
      redirectUri: string
      code: string
    }
  }) {
    const accessToken = await getAccessToken(options.oauthLoginOptions)

    await fetch("https://api.atlassian.com/oauth/token/accessible-resources", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }).then(async (response) => {
      console.log(await response.json())
    })
  }

  getProjects() {
    return [{ name: "name", key: "JIRAUSER10100" }]
  }
}

export class JiraCloudProviderCreator extends ProviderCreator {
  public factoryMethod(): ProviderApi {
    return new JiraCloudProvider()
  }
}
