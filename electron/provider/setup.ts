import { IProvider } from "../providers/base-provider";

let usedProvider: IProvider;

export enum ProviderType {
  JiraServer = "JiraServer",
  JiraCloud = "JiraCloud",
}

export const setProvider = (provider: IProvider) => {
  usedProvider = provider;
};
export const getProvider = () => usedProvider;
