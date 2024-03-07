import { Button, Container, Divider, Image, Paper, rgba } from "@mantine/core";
import { IconCloud, IconServer } from "@tabler/icons-react";
import { ipcRenderer } from "electron";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "@canvas/route-names";
import { useColorScheme } from "@canvas/common/color-scheme";
import { ProviderType } from "@canvas/electron/provider/setup";
import { ColorSchemeToggle } from "../common/ColorSchemeToggle";
import { JiraCloudLogin } from "./jira-cloud/JiraCloudLogin";
import { JiraServerLogin } from "./jira-server/JiraServerLogin";

export function Login() {
  const navigateTo = useNavigate();
  const colorScheme = useColorScheme();

  const [provider, setProvider] = useState("");
  const onSuccess = () => navigateTo(RouteNames.PROJECTS_VIEW);
  const goBack = () => setProvider("");

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
            backgroundColor: colorScheme === "dark" ? rgba("#fff", 0.3) : "transparent",
            borderRadius: "20px",
            padding: "20px",
          })}
        />
        {provider === "" && (
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
              onClick={() => setProvider(ProviderType.JiraServer)}
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
                setProvider(ProviderType.JiraCloud);
                ipcRenderer.send("start-oauth2");
              }}
            >
              Jira Cloud
            </Button>
          </>
        )}
        {provider === ProviderType.JiraServer && (<JiraServerLogin onSuccess={onSuccess} goBack={goBack} />)}
        {provider === ProviderType.JiraCloud && (<JiraCloudLogin onSuccess={onSuccess} goBack={goBack} />)}
      </Paper>
    </Container>
  );
}
