import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "./translations/en.json"
import de from "./translations/de.json"

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: en,
      },
      de: {
        translation: de,
      },
    },
    lng: "de", // set the default language
    fallbackLng: "en", // set the fallback language
  })
