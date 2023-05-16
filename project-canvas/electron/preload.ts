import { ipcRenderer } from "electron"

window.provider = {
  login: () => ipcRenderer.invoke("login"),
}
