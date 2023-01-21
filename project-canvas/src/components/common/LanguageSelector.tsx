import { Select } from "@mantine/core"
import { useTranslation } from "react-i18next"

export function LanguageSelector() {
  const { i18n } = useTranslation()

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language)
  }

  return (
    <Select
      style={{ width: "70px" }}
      onChange={handleLanguageChange}
      data={[
        { value: "en", label: "en" },
        { value: "de", label: "de" },
      ]}
      defaultValue="en"
    />
  )
}
