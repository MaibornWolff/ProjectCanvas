import { Issue } from "project-extender"

export const getEpicsByProject = (projectIdOrKey: string): Promise<Issue[]> =>
  window.provider.getEpicsByProject(projectIdOrKey)
