import { ipcRenderer } from "electron";

window.provider = {
  login: (params) => ipcRenderer.invoke("login", params),
  logout: () => ipcRenderer.invoke("logout"),
  isLoggedIn: () => ipcRenderer.invoke("isLoggedIn"),
  refreshAccessToken: () => ipcRenderer.invoke("refreshAccessToken"),

  getProjects: (...params) => ipcRenderer.invoke("getProjects", ...params),
  getCurrentUser: (...params) =>
    ipcRenderer.invoke("getCurrentUser", ...params),
  getBoardIds: (...params) => ipcRenderer.invoke("getBoardIds", ...params),
  setTransition: (...params) => ipcRenderer.invoke("setTransition", ...params),
  createSubtask: (...params) => ipcRenderer.invoke("createSubtask", ...params),

  editIssue: (...params) => ipcRenderer.invoke("editIssue", ...params),
  createIssue: (...params) => ipcRenderer.invoke("createIssue", ...params),
  getIssuesByProject: (...params) =>
    ipcRenderer.invoke("getIssuesByProject", ...params),
  getIssuesBySprint: (...params) =>
    ipcRenderer.invoke("getIssuesBySprint", ...params),
  getBacklogIssuesByProjectAndBoard: (...params) =>
    ipcRenderer.invoke("getBacklogIssuesByProjectAndBoard", ...params),
  deleteIssue: (...params) => ipcRenderer.invoke("deleteIssue", ...params),
  moveIssueToSprintAndRank: (...params) =>
    ipcRenderer.invoke("moveIssueToSprintAndRank", ...params),
  moveIssueToBacklog: (...params) =>
    ipcRenderer.invoke("moveIssueToBacklog", ...params),
  rankIssueInBacklog: (...params) =>
    ipcRenderer.invoke("rankIssueInBacklog", ...params),

  getIssueTypesByProject: (...params) =>
    ipcRenderer.invoke("getIssueTypesByProject", ...params),
  getLabels: () => ipcRenderer.invoke("getLabels"),
  getPriorities: () => ipcRenderer.invoke("getPriorities"),
  getEditableIssueFields: (...params) =>
    ipcRenderer.invoke("getEditableIssueFields", ...params),
  getIssueReporter: (...params) =>
    ipcRenderer.invoke("getIssueReporter", ...params),
  getIssueTypesWithFieldsMap: () =>
    ipcRenderer.invoke("getIssueTypesWithFieldsMap"),

  createSprint: (...params) => ipcRenderer.invoke("createSprint", ...params),
  getSprints: (...params) => ipcRenderer.invoke("getSprints", ...params),
  getAssignableUsersByProject: (...params) =>
    ipcRenderer.invoke("getAssignableUsersByProject", ...params),
  getEpicsByProject: (...params) =>
    ipcRenderer.invoke("getEpicsByProject", ...params),

  addCommentToIssue: (...params) =>
    ipcRenderer.invoke("addCommentToIssue", ...params),
  editIssueComment: (...params) =>
    ipcRenderer.invoke("editIssueComment", ...params),
  deleteIssueComment: (...params) =>
    ipcRenderer.invoke("deleteIssueComment", ...params),
  getResource: () => ipcRenderer.invoke("getResource"),
};
