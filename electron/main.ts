import { ipcMain, shell, app, BrowserWindow } from "electron";
import * as electron from "electron";
import path from "path";
import { getProviderExecutor, login, refreshAccessToken } from "./provider";
import { handleOAuth2 } from "./OAuthHelper";
import { getExportIssuesHandler } from "./export-issues";

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

let mainWindow: BrowserWindow | null = null;

// eslint-disable-next-line global-require
if (require("electron-squirrel-startup")) {
  app.quit();
  process.exit(0);
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
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
  // Make all links open with the browser, not with the application
  mainWindow.webContents.setWindowOpenHandler(({ url: _url }) => {
    if (_url.startsWith("https:")) shell.openExternal(_url);
    return { action: "deny" };
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length) {
    BrowserWindow.getAllWindows()[0].focus();
  } else {
    createWindow();
  }
});

app.whenReady().then(() => {
  ipcMain.on("start-oauth2", () => handleOAuth2(BrowserWindow.getAllWindows()[0]!));

  ipcMain.handle("supportsProseMirrorPayloads", getProviderExecutor("supportsProseMirrorPayloads"));
  ipcMain.handle("login", login);
  ipcMain.handle("logout", getProviderExecutor("logout"));
  ipcMain.handle("isLoggedIn", getProviderExecutor("isLoggedIn"));
  ipcMain.handle("refreshAccessToken", refreshAccessToken);

  ipcMain.handle("getProjects", getProviderExecutor("getProjects"));
  ipcMain.handle("getCurrentUser", getProviderExecutor("getCurrentUser"));
  ipcMain.handle("getBoardIds", getProviderExecutor("getBoardIds"));
  ipcMain.handle("setTransition", getProviderExecutor("setTransition"));
  ipcMain.handle("createSubtask", getProviderExecutor("createSubtask"));

  ipcMain.handle("editIssue", getProviderExecutor("editIssue"));
  ipcMain.handle("createIssue", getProviderExecutor("createIssue"));
  ipcMain.handle("getIssuesByProject", getProviderExecutor("getIssuesByProject"));
  ipcMain.handle("getIssuesBySprint", getProviderExecutor("getIssuesBySprint"));
  ipcMain.handle("getBacklogIssuesByProjectAndBoard", getProviderExecutor("getBacklogIssuesByProjectAndBoard"));
  ipcMain.handle("deleteIssue", getProviderExecutor("deleteIssue"));
  ipcMain.handle("moveIssueToSprintAndRank", getProviderExecutor("moveIssueToSprintAndRank"));
  ipcMain.handle("moveIssueToBacklog", getProviderExecutor("moveIssueToBacklog"));
  ipcMain.handle("rankIssueInBacklog", getProviderExecutor("rankIssueInBacklog"));

  ipcMain.handle("getIssueTypesByProject", getProviderExecutor("getIssueTypesByProject"));
  ipcMain.handle("getLabels", getProviderExecutor("getLabels"));
  ipcMain.handle("getPriorities", getProviderExecutor("getPriorities"));
  ipcMain.handle("getEditableIssueFields", getProviderExecutor("getEditableIssueFields"));
  ipcMain.handle("getIssueReporter", getProviderExecutor("getIssueReporter"));
  ipcMain.handle("getIssueTypesWithFieldsMap", getProviderExecutor("getIssueTypesWithFieldsMap"));

  ipcMain.handle("createSprint", getProviderExecutor("createSprint"));
  ipcMain.handle("getSprints", getProviderExecutor("getSprints"));
  ipcMain.handle("getAssignableUsersByProject", getProviderExecutor("getAssignableUsersByProject"));
  ipcMain.handle("getEpicsByProject", getProviderExecutor("getEpicsByProject"));

  ipcMain.handle("addCommentToIssue", getProviderExecutor("addCommentToIssue"));
  ipcMain.handle("editIssueComment", getProviderExecutor("editIssueComment"));
  ipcMain.handle("deleteIssueComment", getProviderExecutor("deleteIssueComment"));
  ipcMain.handle("getResource", getProviderExecutor("getResource"));

  ipcMain.on("exportIssues", getExportIssuesHandler(electron, mainWindow!));
});

app.whenReady().then(() => {
  // Launch dev tools in development tools
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL && mainWindow) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools({ mode: "undocked", activate: true });
  }
});
