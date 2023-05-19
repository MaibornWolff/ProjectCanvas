import { ipcRenderer } from "electron"

window.provider = {
  login: () => ipcRenderer.invoke("login"),
  logout: () => ipcRenderer.invoke("logout"),
  isLoggedIn: () => ipcRenderer.invoke("isLoggedIn"),
  refreshAccessToken: () => ipcRenderer.invoke("refreshAccessToken"),

  getProjects: () => ipcRenderer.invoke("getProjects"),
  getCurrentUser: () => ipcRenderer.invoke("getCurrentUser"),
  getBoardIds: () => ipcRenderer.invoke("getBoardIds"),
  setTransition: () => ipcRenderer.invoke("setTransition"),
  createSubtask: () => ipcRenderer.invoke("createSubtask"),

  editIssue: () => ipcRenderer.invoke("editIssue"),
  createIssue: () => ipcRenderer.invoke("createIssue"),
  getIssuesByProject: () => ipcRenderer.invoke("getIssuesByProject"),
  getIssuesBySprint: () => ipcRenderer.invoke("getIssuesBySprint"),
  getBacklogIssuesByProjectAndBoard: () =>
    ipcRenderer.invoke("getBacklogIssuesByProjectAndBoard"),
  deleteIssue: () => ipcRenderer.invoke("deleteIssue"),
  moveIssueToSprintAndRank: () =>
    ipcRenderer.invoke("moveIssueToSprintAndRank"),
  moveIssueToBacklog: () => ipcRenderer.invoke("moveIssueToBacklog"),
  rankIssueInBacklog: () => ipcRenderer.invoke("rankIssueInBacklog"),

  getIssueTypesByProject: () => ipcRenderer.invoke("getIssueTypesByProject"),
  getLabels: () => ipcRenderer.invoke("getLabels"),
  getPriorities: () => ipcRenderer.invoke("getPriorities"),
  getEditableIssueFields: () => ipcRenderer.invoke("getEditableIssueFields"),
  getIssueReporter: () => ipcRenderer.invoke("getIssueReporter"),
  getIssueTypesWithFieldsMap: () =>
    ipcRenderer.invoke("getIssueTypesWithFieldsMap"),
  // setStatus: () => ipcRenderer.invoke("setStatus"),

  createSprint: () => ipcRenderer.invoke("createSprint"),
  getSprints: () => ipcRenderer.invoke("getSprints"),
  getAssignableUsersByProject: () =>
    ipcRenderer.invoke("getAssignableUsersByProject"),
  // getBoardIdsByProject: () => ipcRenderer.invoke("getBoardIdsByProject"),
  // getSprintsByBoardId: () => ipcRenderer.invoke("getSprintsByBoardId"),
  getEpicsByProject: () => ipcRenderer.invoke("getEpicsByProject"),

  addCommentToIssue: () => ipcRenderer.invoke("addCommentToIssue"),
  editIssueComment: () => ipcRenderer.invoke("editIssueComment"),
  deleteIssueComment: () => ipcRenderer.invoke("deleteIssueComment"),
  getResource: () => ipcRenderer.invoke("getResource"),
}
