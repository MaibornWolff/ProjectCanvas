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
      url: addProtocol(loginOptions.url),
    }),
  }).then((response) => {
    if (response.status === 401) {
      showNotification({
        title: "Wrong Password or username",
        message: "Please check your username or password 🤥",
      })
    }
    if (response.status === 403) {
      showNotification({
        title: "Invalid URL",
        message: "URL doesn't correspond to a Jira Server Instance",
      })
    }
    if (response.ok) onSuccess()
  })
}

function addProtocol(url: string) {
  if (!/^(?:f|ht)tps?:\/\//.test(url)) {
    return `https://${url}`
  }
  return url
}
