import { useTranslation } from "react-i18next"

export function LanguageSelector() {
  const { t, i18n } = useTranslation()

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language)
  }

  return (
    <select
      style={{ width: "50px" }}
      onChange={(e) => handleLanguageChange(e.target.value)}
    >
      {i18n.languages.map((language) => (
        <option key={language} value={language}>
          {t(`${language}`)}
        </option>
      ))}
    </select>
  )
}
