import {
  Button,
  ColorInput,
  Container,
  Flex,
  Group,
  Stack,
  TextInput,
  Title,
} from "@mantine/core"
import { useForm } from "@mantine/form"

const App = () => {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  })
  return (
    <Container>
      <Flex justify="center">
        <Stack spacing="md">
          <Title size="2em">Login</Title>
          <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <TextInput
              required
              label="Email"
              placeholder="Email"
              {...form.getInputProps("email")}
            />
            <TextInput
              required
              label="Password"
              placeholder="Password"
              {...form.getInputProps("password")}
            />

            <Group position="center" mt="xl">
              <Button type="submit">Log in</Button>
            </Group>
          </form>
        </Stack>
      </Flex>
    </Container>
  )
}

export default App
