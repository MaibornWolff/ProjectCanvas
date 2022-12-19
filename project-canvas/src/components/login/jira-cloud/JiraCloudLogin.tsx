import { Button, Center, Loader } from "@mantine/core"

export function JiraCloudLogin({ goBack }: { goBack: () => void }) {
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
