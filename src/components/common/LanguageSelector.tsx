import { Select } from "@mantine/core"
import { useTranslation } from "react-i18next"

export function LanguageSelector() {
  const { i18n } = useTranslation()

  const handleLanguageChange = (language: string | null) => {
    i18n.changeLanguage(language || undefined)
  }

  return (
    <Select
      size="xs"
      onChange={handleLanguageChange}
      data={[
        { value: "en", label: "EN" },
        { value: "de", label: "DE" },
      ]}
      defaultValue="en"
      style={{
        width: "48px",
        input: { padding: "10px" },
        rightSection: { padding: "0px" },
      }}
    />
  )
}
