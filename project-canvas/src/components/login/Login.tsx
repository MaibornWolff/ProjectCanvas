import { Button, Container, Divider, Stack, Title } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useNavigate } from "react-router-dom"
import { ipcRenderer } from "electron"
import { LoginForm } from "./LoginForm"
import { LoginFormValues } from "./LoginFormValues"

ipcRenderer.on("code", (_, code) => {
  alert(code)
  fetch("http://localhost:9090/logincloud", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  })
})

async function login({
  protocol = "http",
  host = "localhost",
  port = "8080",
  username = "admin",
  password = "admin",
}: {
  protocol: string
  host: string
  port: string
  username: string
  password: string
  apiVersion: string
  strictSSL: boolean
}) {
  const body = {
    protocol,
    host,
    port,
    username,
    password,
  }

  await fetch("http://localhost:9090/login", {
    method: "post",
    body: JSON.stringify(body),
  })
  await fetch("http://localhost:9090/board").then(async (res) =>
    console.log(await res.json())
  )
}

export function Login() {
  const navigate = useNavigate()
  const form = useForm<LoginFormValues>({
    initialValues: {
      username: "",
      password: "",
      url: "",
    },
  })
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
        <LoginForm form={form} onSubmit={login} />
        <Divider my="sm" label="Jira Cloud Login" labelPosition="center" />
        <Button color="secondary" onClick={() => navigate("/projectsview")}>
          Jira Cloud
        </Button>
      </Stack>
    </Container>
  )
}
