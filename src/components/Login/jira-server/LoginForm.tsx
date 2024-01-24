import { Button, Group, PasswordInput, Stack, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { LoginFormValues } from "./LoginFormValues"
import { loginToJiraServer } from "./loginToJiraServer"
import { getImportMetaEnv } from "../../../get-meta-env"

export function LoginForm({
  goBack,
  onSuccess,
}: {
  goBack: () => void
  onSuccess: () => void
}) {
  const metaEnv = getImportMetaEnv()
  const form = useForm<LoginFormValues>({
    initialValues: {
      url: metaEnv.VITE_JIRA_SERVER_DEFAULT_URL ?? "",
      username: metaEnv.VITE_JIRA_SERVER_DEFAULT_USERNAME ?? "",
      password: metaEnv.VITE_JIRA_SERVER_DEFAULT_PASSWORD ?? "",
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
          placeholder="https://jira.example.com"
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

      <Group justify="center" mt="xl">
        <Button
          type="submit"
          variant="gradient"
          gradient={{
            from: "primaryGreen.5",
            to: "primaryGreen.8",
            deg: 60,
          }}
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
