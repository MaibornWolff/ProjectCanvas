import { useForm } from "@mantine/form"
import { LoginFormValues } from "../LoginFormValues"
import { LoginForm } from "./LoginForm"

export function JiraServerLogin({ goBack }: { goBack: () => void }) {
  async function login({
    host,
    port,
    username,
    password,
  }: {
    host: string
    port: string
    username: string
    password: string
  }) {
    await fetch(`${import.meta.env.VITE_EXTENDER}/login`, {
      method: "post",
      body: JSON.stringify({
        host,
        port,
        username,
        password,
      }),
    })
    await fetch(`${import.meta.env.VITE_EXTENDER}/projects`).then(async (res) =>
      console.log(await res.json())
    )
  }
  const form = useForm<LoginFormValues>({
    initialValues: {
      username: "",
      password: "",
      url: "",
    },
  })
  // eslint-disable-next-line react/jsx-no-bind
  return <LoginForm form={form} onSubmit={login} goBack={goBack} />
}
