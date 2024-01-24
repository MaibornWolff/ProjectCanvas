import { BasicLoginOptions } from "../providers/base-provider";
import { JiraCloudProvider } from "../providers/jira-cloud-provider";
import { JiraServerProvider } from "../providers/jira-server-provider";
import { getProvider, ProviderType, setProvider } from "./setup";

export type LoginOptions =
  | { provider: ProviderType.JiraServer; basicLoginOptions: BasicLoginOptions }
  | { provider: ProviderType.JiraCloud; code: string };

export async function login(
  _: Electron.IpcMainInvokeEvent,
  loginOptions: LoginOptions
) {
  if (loginOptions.provider === ProviderType.JiraServer) {
    setProvider(new JiraServerProvider());
    await getProvider().login({
      basicLoginOptions: loginOptions.basicLoginOptions,
    });
  }
  if (loginOptions.provider === ProviderType.JiraCloud) {
    setProvider(new JiraCloudProvider());
    await getProvider().login({
      oauthLoginOptions: {
        code: loginOptions.code,
        clientId: import.meta.env.VITE_CLIENT_ID!,
        clientSecret: import.meta.env.VITE_CLIENT_SECRET!,
        redirectUri: import.meta.env.VITE_REDIRECT_URI!,
      },
    });
  }
}

export async function isLoggedIn() {
  await getProvider().isLoggedIn();
}
export async function logout() {
  await getProvider().logout();
}
export async function refreshAccessToken() {
  await getProvider().refreshAccessToken({
    clientId: import.meta.env.VITE_CLIENT_ID,
    clientSecret: import.meta.env.VITE_CLIENT_SECRET,
  });
}
