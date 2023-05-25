import { Issue, Sprint, SprintCreate } from "project-extender"

export const getSprints = (boardId: number): Promise<Sprint[]> =>
  window.provider.getSprints(boardId)

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
