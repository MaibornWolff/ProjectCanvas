import { showNotification } from "@mantine/notifications"
import { ipcRenderer } from "electron"

export async function loginToJiraServer({
  onSuccess,
  loginOptions,
}: {
  onSuccess: () => void
  loginOptions: { url: string; username: string; password: string }
}) {
  ipcRenderer
    .invoke("login", {
      provider: "JiraServer",
      basicLoginOptions: {
        ...loginOptions,
        url: addProtocol(loginOptions.url),
      },
    })
    .then(() => onSuccess())
    .catch((error) => {
      showNotification({
        title: error.name,
        message: error.message,
        color: "red",
      })
    })
}

function addProtocol(url: string) {
  if (!/^(?:f|ht)tps?:\/\//.test(url)) {
    return `https://${url}`
  }
  return url
}
