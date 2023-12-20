import { Issue, Sprint, SprintCreate } from "types"

export const getSprints = (boardId: number): Promise<Sprint[]> =>
  window.provider.getSprints(boardId)

export const getIssuesByProject = (
  projectKey: string | undefined,
  boardId: number
): Promise<Issue[]> => window.provider.getIssuesByProject(projectKey || "", boardId)

export const getIssuesBySprint = (
  sprintId: number | undefined
): Promise<Issue[]> => window.provider.getIssuesBySprint(sprintId || 0)

export const getBacklogIssues = (
  projectKey: string | undefined,
  boardId: number
): Promise<Issue[]> =>
  window.provider.getBacklogIssuesByProjectAndBoard(projectKey || "", boardId)

export const createSprint = (sprint: SprintCreate): Promise<void> =>
  window.provider.createSprint(sprint)
