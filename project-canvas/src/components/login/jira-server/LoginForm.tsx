import { Button, Group, PasswordInput, Stack, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useTranslation } from "react-i18next"
import { LoginFormValues } from "./LoginFormValues"
import { loginToJiraServer } from "./loginToJiraServer"

export function LoginForm({
  goBack,
  onSuccess,
}: {
  goBack: () => void
  onSuccess: () => void
}) {
  const { t } = useTranslation()
  const form = useForm<LoginFormValues>({
    initialValues: {
      url: "localhost:8080",
      username: "admin",
      password: "admin",
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
          label={t("Login-Server.url")}
          placeholder={t("Login-Server.url")}
          {...form.getInputProps("url")}
        />
        <TextInput
          required
          label={t("Login-Server.username")}
          placeholder={t("Login-Server.username")}
          {...form.getInputProps("username")}
        />
        <PasswordInput
          required
          label={t("Login-Server.password")}
          placeholder={t("Login-Server.password")}
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
          {t("Common.btn-goBack")}
        </Button>
      </Group>
    </form>
  )
}
