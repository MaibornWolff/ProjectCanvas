import { ipcRenderer } from "electron"

let listenerSetUp = false
let refreshInterval: string | number | NodeJS.Timeout | undefined

export function loginToJiraCloud({ onSuccess }: { onSuccess: () => void }) {
  if (!listenerSetUp) {
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
            refreshInterval = setInterval(refreshAccessToken, 55 * 60 * 1000)
            onSuccess()
          }
        })
      }
    })
    listenerSetUp = true
  }
}

async function refreshAccessToken() {
  const isLoggedIn = await fetch(`${import.meta.env.VITE_EXTENDER}/isLoggedIn`)
    .then((res) => {
      if (res.status === 200) return true
      return false
    })
    .catch(() => false)

  if (!isLoggedIn) {
    clearInterval(refreshInterval)
    return
  }

  await fetch(`${import.meta.env.VITE_EXTENDER}/refreshAccessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider: "JiraCloud" }),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to refresh access token: ${await response.text()}`
        )
      }
    })
    .catch((err) => {
      throw new Error(`Failed to refresh access token: ${err}`)
    })
}
