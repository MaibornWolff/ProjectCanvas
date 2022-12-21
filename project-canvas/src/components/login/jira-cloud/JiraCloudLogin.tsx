import { Button, Center, Loader } from "@mantine/core"
import { loginToJiraCloud } from "./loginToJiraCloud"

export function JiraCloudLogin({
  goBack,
  onSuccess,
}: {
  goBack: () => void
  onSuccess: () => void
}) {
  loginToJiraCloud({ onSuccess })

  return (
    <>
      <Center sx={{ height: "200px" }}>
        <Loader size="xl" />
      </Center>
      <Button variant="outline" fullWidth color="dark" onClick={goBack}>
        Go Back
      </Button>
    </>
  )
}
