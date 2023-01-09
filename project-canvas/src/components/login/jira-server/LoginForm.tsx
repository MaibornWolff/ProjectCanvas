import { Button, Group, PasswordInput, Stack, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { LoginFormValues } from "./LoginFormValues"
import { loginToJiraServer } from "./loginToJiraServer"

export function LoginForm({
  goBack,
  onSuccess,
}: {
  goBack: () => void
  onSuccess: () => void
}) {
  const form = useForm<LoginFormValues>({
    initialValues: {
      url: "localhost:8080",
      username: "oussema",
      password: "Oussema",
    },
  })
  return (
    <form
      onSubmit={form.onSubmit((loginOptions) =>
        loginToJiraServer({ onSuccess, loginOptions })
      )}
    >
      <Stack>
        <TextInput
          required
          label="Instance URL"
          placeholder="URL"
          {...form.getInputProps("url")}
        />
        <TextInput
          required
          label="Username"
          placeholder="Username"
          {...form.getInputProps("username")}
        />
        <PasswordInput
          required
          label="Password"
          placeholder="Password"
          {...form.getInputProps("password")}
        />
      </Stack>

      <Group position="center" mt="xl">
        <Button
          type="submit"
          variant="gradient"
          gradient={{ from: "teal", to: "blue", deg: 60 }}
          fullWidth
        >
          Log in
        </Button>
        <Button variant="outline" fullWidth color="dark" onClick={goBack}>
          Go Back
        </Button>
      </Group>
    </form>
  )
}
