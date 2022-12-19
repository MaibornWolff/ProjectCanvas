import { Button, Group, Stack, TextInput } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { LoginFormValues } from "../LoginFormValues"

export function LoginForm({
  form,
  onSubmit,
  goBack,
}: {
  form: UseFormReturnType<LoginFormValues>
  onSubmit: () => Promise<void>
  goBack: () => void
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
