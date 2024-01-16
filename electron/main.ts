import { ipcMain, shell, app, BrowserWindow } from "electron"
import * as electron from 'electron'
import path from "path"
import { handleOAuth2 } from "./OAuthHelper"
import {
  addCommentToIssue,
  createIssue,
  createSprint,
  createSubtask,
  deleteIssue,
  deleteIssueComment,
  editIssue,
  editIssueComment,
  getAssignableUsersByProject,
  getBacklogIssuesByProjectAndBoard,
  getBoardIds,
  getCurrentUser,
  getEditableIssueFields,
  getEpicsByProject,
  getIssueReporter,
  getIssuesByProject,
  getIssuesBySprint,
  getIssueTypesByProject,
  getIssueTypesWithFieldsMap,
  getLabels,
  getPriorities,
  getProjects,
  getResource,
  getSprints,
  isLoggedIn,
  login,
  logout,
  moveIssueToBacklog,
  moveIssueToSprintAndRank,
  rankIssueInBacklog,
  refreshAccessToken,
  setTransition,
} from "./provider"
import { getExportIssuesHandler } from "./export-issues";

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string
declare const MAIN_WINDOW_VITE_NAME: string

let mainWindow: BrowserWindow | null = null

// eslint-disable-next-line global-require
if (require("electron-squirrel-startup")) {
  app.quit()
  process.exit(0)
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

  ipcMain.handle("login", login)
  ipcMain.handle("logout", logout)
  ipcMain.handle("isLoggedIn", isLoggedIn)
  ipcMain.handle("refreshAccessToken", refreshAccessToken)

  ipcMain.handle("getProjects", getProjects)
  ipcMain.handle("getCurrentUser", getCurrentUser)
  ipcMain.handle("getBoardIds", getBoardIds)
  ipcMain.handle("setTransition", setTransition)
  ipcMain.handle("createSubtask", createSubtask)

  ipcMain.handle("editIssue", editIssue)
  ipcMain.handle("createIssue", createIssue)
  ipcMain.handle("getIssuesByProject", getIssuesByProject)
  ipcMain.handle("getIssuesBySprint", getIssuesBySprint)
  ipcMain.handle(
    "getBacklogIssuesByProjectAndBoard",
    getBacklogIssuesByProjectAndBoard
  )
  ipcMain.handle("deleteIssue", deleteIssue)
  ipcMain.handle("moveIssueToSprintAndRank", moveIssueToSprintAndRank)
  ipcMain.handle("moveIssueToBacklog", moveIssueToBacklog)
  ipcMain.handle("rankIssueInBacklog", rankIssueInBacklog)

  ipcMain.handle("getIssueTypesByProject", getIssueTypesByProject)
  ipcMain.handle("getLabels", getLabels)
  ipcMain.handle("getPriorities", getPriorities)
  ipcMain.handle("getEditableIssueFields", getEditableIssueFields)
  ipcMain.handle("getIssueReporter", getIssueReporter)
  ipcMain.handle("getIssueTypesWithFieldsMap", getIssueTypesWithFieldsMap)

  ipcMain.handle("createSprint", createSprint)
  ipcMain.handle("getSprints", getSprints)
  ipcMain.handle("getAssignableUsersByProject", getAssignableUsersByProject)
  ipcMain.handle("getEpicsByProject", getEpicsByProject)

  ipcMain.handle("addCommentToIssue", addCommentToIssue)
  ipcMain.handle("editIssueComment", editIssueComment)
  ipcMain.handle("deleteIssueComment", deleteIssueComment)
  ipcMain.handle("getResource", getResource)

  ipcMain.on("exportIssues", getExportIssuesHandler(electron, mainWindow!))
})

app.whenReady().then(() => {
  // Launch dev tools in development tools
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL && mainWindow) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }
})
