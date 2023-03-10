import { resources, defaultNS } from "./i18n"

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS
    resources: {
      login: (typeof resources)[en]["login"]
      login: (typeof resources)[de]["login"]
      projectsView: (typeof resources)[en]["projectsView"]
      projectsView: (typeof resources)[de]["projectsView"]
      backlogView: (typeof resources)[en]["backlogView"]
      backlogView: (typeof resources)[de]["backlogView"]
    }
  }
}
