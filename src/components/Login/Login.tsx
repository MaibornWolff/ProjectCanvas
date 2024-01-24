import { Button, Container, Divider, Image, Paper, rgba } from "@mantine/core"
import { IconCloud, IconServer } from "@tabler/icons-react"
import { ipcRenderer } from "electron"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ColorSchemeToggle } from "../common/ColorSchemeToggle"
import { JiraCloudLogin } from "./jira-cloud/JiraCloudLogin"
import { JiraServerLogin } from "./jira-server/JiraServerLogin"
import { useColorScheme } from "../../common/color-scheme";
import { RouteNames } from "../../route-names";

export function Login() {
  const [providerLogin, setProviderLogin] = useState("")
  const navigateTo = useNavigate()
  const onSuccess = () => navigateTo(RouteNames.PROJECTS_VIEW)
  const goBack = () => setProviderLogin("")
  const colorScheme = useColorScheme()

  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper
        p="lg"
        withBorder
        style={(theme) => ({
          width: "30vw",
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing.sm,
          boxShadow: theme.shadows.xl,
          borderRadius: theme.radius.lg,
        })}
      >
        <ColorSchemeToggle ml="auto" />
        <Image
          mx="auto"
          src="./project_canvas_logo.svg"
          style={() => ({
            maxWidth: "220px",
            backgroundColor:
              colorScheme === "dark"
                ? rgba("#fff", 0.3)
                : "transparent",
            borderRadius: "20px",
            padding: "20px",
          })}
        />

        {providerLogin === "" && (
          <>
            <Divider
              my="lg"
              label="Please choose a Provider"
              labelPosition="center"
            />
            <Button
              size="xl"
              variant="gradient"
              gradient={{
                from: "primaryGreen.5",
                to: "primaryGreen.8",
                deg: 60,
              }}
              leftSection={<IconServer size={32} strokeWidth={1.8} />}
              onClick={() => {
                setProviderLogin("JiraServer")
              }}
            >
              Jira Server
            </Button>
            <Button
              size="xl"
              variant="gradient"
              gradient={{
                from: "primaryBlue.3",
                to: "primaryBlue.6",
                deg: 60,
              }}
              leftSection={<IconCloud size={32} strokeWidth={1.8} />}
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
      </Paper>
    </Container>
  )
}
