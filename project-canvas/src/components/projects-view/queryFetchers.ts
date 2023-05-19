import { ipcRenderer } from "electron"
import { Project } from "types"

export const getProjects = (): Promise<Project[]> =>
  ipcRenderer.invoke("getProjects")
