import { ipcRenderer } from "electron"

export function loginToJiraCloud({ onSuccess }: { onSuccess: () => void }) {
  ipcRenderer.on("code", (_, code) => {
    fetch(`${import.meta.env.VITE_EXTENDER}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider: "JiraCloud", code }),
    }).then((response) => {
      if (response.ok) onSuccess()
    })
  })
}
