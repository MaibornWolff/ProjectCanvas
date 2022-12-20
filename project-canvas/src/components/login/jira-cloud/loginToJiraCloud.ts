import { ipcRenderer } from "electron"

export function loginToJiraCloud({ onSuccess }: { onSuccess: () => void }) {
  let lastCode: string
  ipcRenderer.on("code", async (_, code) => {
    if (code !== lastCode) {
      lastCode = code
      await fetch(`${import.meta.env.VITE_EXTENDER}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "JiraCloud", code }),
      }).then((response) => {
        if (response.ok) {
          onSuccess()
        }
      })
    }
  })
}
