import { Stack, Select, TextInput, Group, Button } from "@mantine/core"
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
        <Select
          required
          label="PBI server"
          placeholder="PBI server"
          data={[
            { value: "Jira Server", label: "Jira Server" },
            { value: "Jira Cloud", label: "Jira Cloud" },
          ]}
          {...form.getInputProps("pbiServer")}
        />
        {form.values.pbiServer === "Jira Server" && (
          <>
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
          </>
        )}
        {form.values.pbiServer === "Jira Cloud" && (
          <TextInput
            required
            label="Email"
            placeholder="Email"
            {...form.getInputProps("email")}
          />
        )}

        <TextInput
          required
          label="Password"
          placeholder="Password"
          {...form.getInputProps("password")}
        />
      </Stack>

      <Group position="center" mt="xl">
        <Button type="submit" fullWidth>
          Log in
        </Button>
      </Group>
    </form>
  )
}
