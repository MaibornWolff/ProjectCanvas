import { Button, Center, Loader } from "@mantine/core"
import { useTranslation } from "react-i18next"
import { loginToJiraCloud } from "./loginToJiraCloud"

export function JiraCloudLogin({
  goBack,
  onSuccess,
}: {
  goBack: () => void
  onSuccess: () => void
}) {
  const { t } = useTranslation()
  loginToJiraCloud({ onSuccess })

  return (
    <>
      <Center sx={{ height: "200px" }}>
        <Loader size="xl" />
      </Center>
      <Button variant="outline" fullWidth color="dark" onClick={goBack}>
        {t("Common.btn-goBack")}
      </Button>
    </>
  )
}
