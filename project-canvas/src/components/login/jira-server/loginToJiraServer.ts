import { showNotification } from "@mantine/notifications"

export function loginToJiraServer({
  onSuccess,
  loginOptions,
}: {
  onSuccess: () => void
  loginOptions: { url: string; username: string; password: string }
}) {
  fetch(`${import.meta.env.VITE_EXTENDER}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider: "JiraServer",
      ...loginOptions,
    }),
  }).then((response) => {
    if (response.status === 401) {
      return showNotification({
        title: "Wrong Password or username",
        message: "Please check your username or password 🤥",
      })
    }
    if (response.status === 403) {
      return showNotification({
        title: "Wrong URL",
        message: "Please check your URL",
      })
    }
    if (response.ok) onSuccess()
    return () => {}
  })
}
