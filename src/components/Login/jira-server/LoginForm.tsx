import { Button, Group, PasswordInput, Stack, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useTranslation } from "react-i18next"
import { LoginFormValues } from "./LoginFormValues"
import { loginToJiraServer } from "./loginToJiraServer"
import { getImportMetaEnv } from "../../../get-meta-env";

export function LoginForm({
  goBack,
  onSuccess,
}: {
  goBack: () => void
  onSuccess: () => void
}) {
  const { t } = useTranslation("login")
  const metaEnv = getImportMetaEnv()
  const form = useForm<LoginFormValues>({
    initialValues: {
      url: metaEnv.VITE_JIRA_SERVER_DEFAULT_URL ?? '',
      username: metaEnv.VITE_JIRA_SERVER_DEFAULT_USERNAME ?? '',
      password: metaEnv.VITE_JIRA_SERVER_DEFAULT_PASSWORD ?? '',
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
          label={t("url")}
          placeholder={t("urlPlaceholder")}
          {...form.getInputProps("url")}
        />
        <TextInput
          required
          label={t("username")}
          placeholder={t("username")}
          {...form.getInputProps("username")}
        />
        <PasswordInput
          required
          label={t("password")}
          placeholder={t("password")}
          {...form.getInputProps("password")}
        />
      </Stack>

      <Group position="center" mt="xl">
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
          {t("button.goBack")}
        </Button>
      </Group>
    </form>
  )
}
