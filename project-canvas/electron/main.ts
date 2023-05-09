import { ipcMain, shell, app, BrowserWindow } from "electron"
import path from "path"
import { handleOAuth2 } from "./OAuthHelper"

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string
declare const MAIN_WINDOW_VITE_NAME: string

let mainWindow: BrowserWindow | null = null

// eslint-disable-next-line global-require
if (require("electron-squirrel-startup")) {
  app.quit()
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, "favicon.svg"),
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    )
  }
  // Make all links open with the browser, not with the application
  mainWindow.webContents.setWindowOpenHandler(({ url: _url }) => {
    if (_url.startsWith("https:")) shell.openExternal(_url)
    return { action: "deny" }
  })
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length) {
    BrowserWindow.getAllWindows()[0].focus()
  } else {
    createWindow()
  }
})

app.whenReady().then(() => {
  ipcMain.on("start-oauth2", () =>
    handleOAuth2(BrowserWindow.getAllWindows()[0]!)
  )
})

app.whenReady().then(() => {
  // Launch project extender fastify server
  // eslint-disable-next-line global-require
  require("project-extender")

  // Launch dev tools in development tools
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL && mainWindow) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }
})
