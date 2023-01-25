import { Select } from "@mantine/core"
import { useTranslation } from "react-i18next"

export function LanguageSelector() {
  const { i18n } = useTranslation()

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language)
  }

  return (
    <Select
      size="xs"
      sx={{ width: "48px" }}
      onChange={handleLanguageChange}
      data={[
        { value: "en", label: "EN" },
        { value: "de", label: "DE" },
      ]}
      defaultValue="en"
      styles={{
        input: { padding: "10px" },
        rightSection: { padding: "0px" },
      }}
    />
  )
}
