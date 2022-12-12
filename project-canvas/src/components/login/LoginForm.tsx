import { Button, Group, Stack, TextInput } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { LoginFormValues } from "./LoginFormValues"

export function LoginForm({
  form,
  onSubmit,
}: {
  form: UseFormReturnType<LoginFormValues>
  onSubmit: any
}) {
  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
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
        <TextInput
          required
          label="Password"
          placeholder="Password"
          {...form.getInputProps("password")}
        />
      </Stack>

      <Group position="center" mt="xl">
        <Button type="submit" fullWidth>
          Log in to Jira Server
        </Button>
      </Group>
    </form>
  )
}
