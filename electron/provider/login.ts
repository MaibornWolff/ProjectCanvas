import { BasicAuthLoginOptions } from "../providers/base-provider";
import { JiraCloudProvider } from "../providers/jira-cloud-provider";
import { JiraServerProvider } from "../providers/jira-server-provider";
import { getProvider, ProviderType, setProvider } from "./setup";

export type LoginOptions =
  | { provider: ProviderType.JiraServer, basicAuthLoginOptions: BasicAuthLoginOptions }
  | { provider: ProviderType.JiraCloud, code: string };

export async function login(
  _: Electron.IpcMainInvokeEvent,
  loginOptions: LoginOptions,
) {
  switch (loginOptions.provider) {
    case ProviderType.JiraServer:
      setProvider(new JiraServerProvider());
      await getProvider().login({ basicAuthLoginOptions: loginOptions.basicAuthLoginOptions });
      break;
    case ProviderType.JiraCloud:
      setProvider(new JiraCloudProvider());
      await getProvider().login({
        oAuthLoginOptions: {
          code: loginOptions.code,
          clientId: import.meta.env.VITE_CLIENT_ID!,
          clientSecret: import.meta.env.VITE_CLIENT_SECRET!,
          redirectUri: import.meta.env.VITE_REDIRECT_URI!,
        },
      });
      break;
    default: throw new Error(`Unknown provider type encountered: ${loginOptions}`);
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
