/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import { ProviderApi, ProviderCreator } from "../base-provider"
import { getAccessToken } from "./getAccessToken"

class JiraCloudProvider implements ProviderApi {
  static accessToken: string | undefined

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
    // TODO: get projects from API
    return [{ name: "placeholder", key: "PLACEHOLDER" }]
  }

  // EXEMPLE
  // async getResources() {
  //   await fetch("https://api.atlassian.com/oauth/token/accessible-resources", {
  //     headers: {
  //       Accept: "application/json",
  //       Authorization: `Bearer ${this.accessToken}`,
  //     },
  //   }).then(async (response) => {
  //     console.log(await response.json())
  //   })
  // }
}

export class JiraCloudProviderCreator extends ProviderCreator {
  public factoryMethod(): ProviderApi {
    return new JiraCloudProvider()
  }
}
