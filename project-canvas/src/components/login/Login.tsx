import { Button, Container, Divider, Stack, Title } from "@mantine/core"
import { IconCloud, IconServer } from "@tabler/icons"
import { ipcRenderer } from "electron"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { JiraCloudLogin } from "./jira-cloud/JiraCloudLogin"
import { JiraServerLogin } from "./jira-server/JiraServerLogin"

export function Login() {
  const [providerLogin, setProviderLogin] = useState("")
  const navigateTo = useNavigate()
  const onSuccess = () => navigateTo("/projectsview")
  const goBack = () => setProviderLogin("")
  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Stack
        justify="center"
        align="stretch"
        spacing="lg"
        sx={(theme) => ({
          width: "25vw",
          boxShadow: theme.shadows.lg,
          borderRadius: theme.radius.lg,
        })}
        p="lg"
        mx="auto"
      >
        <Title size="2em" align="center" mb="2em">
          Project Canvas
        </Title>
        <Title size="2em" align="center">
          Login
        </Title>
        {providerLogin === "" && (
          <>
            <Divider
              my="lg"
              label="Please Choose a Provider"
              labelPosition="center"
            />
            <Button
              size="xl"
              variant="gradient"
              gradient={{ from: "teal", to: "blue", deg: 60 }}
              leftIcon={<IconServer size={20} />}
              onClick={() => {
                setProviderLogin("JiraServer")
              }}
            >
              Jira Server
            </Button>
            <Button
              size="xl"
              variant="gradient"
              gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
              leftIcon={<IconCloud size={20} />}
              onClick={() => {
                setProviderLogin("JiraCloud")
                ipcRenderer.send("start-oauth2")
              }}
            >
              Jira Cloud
            </Button>
          </>
        )}
        {providerLogin === "JiraServer" && (
          <JiraServerLogin onSuccess={onSuccess} goBack={goBack} />
        )}
        {providerLogin === "JiraCloud" && (
          <JiraCloudLogin onSuccess={onSuccess} goBack={goBack} />
        )}
      </Stack>
    </Container>
  )
}
