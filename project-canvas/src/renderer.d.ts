import { IProvider } from "../electron/providers/base-provider"

declare global {
  interface Window {
    provider: IProvider
  }
}
