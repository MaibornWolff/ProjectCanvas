import i18next from "i18next"
import { initReactI18next } from "react-i18next"

import backlogViewEn from "./translations/en/backlogView.json"
import backlogViewDe from "./translations/de/backlogView.json"
import loginEn from "./translations/en/login.json"
import loginDe from "./translations/de/login.json"
import projectViewEn from "./translations/en/projectsView.json"
import projectViewDe from "./translations/de/projectsView.json"

export const defaultNS = "login"

export const resources = {
  en: {
    backlogView: backlogViewEn,
    login: loginEn,
    projectsView: projectViewEn,
  },
  de: {
    backlogView: backlogViewDe,
    login: loginDe,
    projectsView: projectViewDe,
  },
} as const

i18next.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  defaultNS,
  resources,
  compatibilityJSON: "v3",
  ns: ["login", "backlogView", "projectsView"],
})
