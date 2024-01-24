import { Issue } from "../../../../types"

export const getEpics = (projectKey: string | undefined): Promise<Issue[]> =>
  window.provider.getEpicsByProject(projectKey || "")
