/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProviderApi } from "electron/providers/base-provider"

declare global {
  interface Window {
    // TODO: Partial should be removed after all functions have been implemented in electron agrain
    provider: Partial<ProviderApi>
  }
}
