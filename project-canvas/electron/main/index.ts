// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
import { app, BrowserWindow, shell, ipcMain } from "electron"
import { release } from "os"
import { join } from "path"

// import "project-extender"

process.env.DIST_ELECTRON = join(__dirname, "../..")
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist")
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : join(process.env.DIST_ELECTRON, "../public")
// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js")
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, "index.html")

async function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    icon: join(process.env.PUBLIC, "favicon.svg"),
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url: _url }) => {
    if (_url.startsWith("https:")) shell.openExternal(_url)
    return { action: "deny" }
  })
}

app.whenReady().then(createWindow)

app.on("window-all-closed", () => {
  win = null
  if (process.platform !== "darwin") app.quit()
})

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// new window example arg: new windows url
ipcMain.handle("open-win", (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (app.isPackaged) {
    childWindow.loadFile(indexHtml, { hash: arg })
  } else {
    childWindow.loadURL(`${url}#${arg}`)
    // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }
})

app.whenReady().then(() => {
  const authWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
  })
  const authUrl =
    "https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=511A0SDAnrGJxxw4hrwYa2SOsRzpEbNC&scope=read:me%20read:jira-user%20manage:jira-configuration%20read:jira-work%20read:account%20manage:jira-project%20manage:jira-configuration%20write:jira-work%20manage:jira-webhook%20manage:jira-data-provider&redirect_uri=http://localhost:5173&response_type=code&prompt=consent"

  authWindow.loadURL(authUrl)
  authWindow.show()

  function handleCallback(_url) {
    const rawCode = /\?code=(.+)/.exec(_url) || null
    const code = rawCode && rawCode.length > 1 ? rawCode[1] : null
    const error = /\?error=(.+)\$/.exec(_url)

    if (code || error) {
      // Close the browser if code found or error
      authWindow.destroy()
    }

    // If there is a code, proceed to get token from github
    if (code) {
      // self.requestGithubToken(options, code)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  authWindow.webContents.on("will-redirect", (_, url) => {
    handleCallback(url)
  })
})
