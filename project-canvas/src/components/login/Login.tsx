import { Container, Stack, Title } from "@mantine/core"
import { useForm } from "@mantine/form"
import { LoginForm } from "./LoginForm"
import { LoginFormValues } from "./LoginFormValues"

export function Login() {
  const form = useForm<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
      pbiServer: "",
      url: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
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
        <LoginForm form={form} />
      </Stack>
    </Container>
  )
}
