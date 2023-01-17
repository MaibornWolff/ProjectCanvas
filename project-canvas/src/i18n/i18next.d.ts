import { resources, defaultNS } from "./i18n"

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS
    resources: {
      login: typeof resources[de][en]["login"]
      projectsView: typeof resources[de][en]["projectsView"]
      backlogView: typeof resources[de][en]["backlogView"]
    }
  }
}
