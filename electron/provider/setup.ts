import { IProvider } from "../providers/base-provider"

let issueProvider: IProvider

export enum ProviderType {
  JiraServer = "JiraServer",
  JiraCloud = "JiraCloud",
}

export const setProvider = (provider: IProvider) => {
  issueProvider = provider
}
export const getProvider = () => issueProvider
