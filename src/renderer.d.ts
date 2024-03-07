import { IProvider } from "@canvas/electron/providers/base-provider";
import { LoginOptions } from "@canvas/electron/provider";

declare global {
  interface Window {
    // Adjusting the IProvider because exposed parameters to renderer do not match (i.e. don't contain the secrets)
    provider: IProvider & {
      login: (loginOptions: LoginOptions) => Promise<void>,
      refreshAccessToken: () => Promise<void>,
    },
  }
}
