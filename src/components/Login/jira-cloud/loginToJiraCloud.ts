import { ipcRenderer } from "electron";

let listenerSetUp = false;
let refreshInterval: string | number | NodeJS.Timeout | undefined;

export function loginToJiraCloud({ onSuccess }: { onSuccess: () => void }) {
  if (!listenerSetUp) {
    let lastCode: string;
    ipcRenderer.on("code", async (_, code: string) => {
      if (code !== lastCode) {
        lastCode = code;
        window.provider.login({ provider: "JiraCloud", code }).then(() => {
          refreshInterval = setInterval(refreshAccessToken, 55 * 60 * 1000);
          onSuccess();
        });
      }
    });
    listenerSetUp = true;
  }
}

async function refreshAccessToken() {
  const isLoggedIn = await window.provider
    .isLoggedIn()
    .then(() => true)
    .catch(() => false);

  if (!isLoggedIn) {
    clearInterval(refreshInterval);
    return;
  }

  await window.provider.refreshAccessToken();
}
