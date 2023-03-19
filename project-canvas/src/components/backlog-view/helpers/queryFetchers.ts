import { Issue, Sprint, SprintCreate } from "project-extender"

export const getSprints = (boardId: number): Promise<Sprint[]> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/sprintsByBoardId?boardId=${boardId}`)
    .then((sprints) => sprints.json())
    .catch((err) => err)

export const getIssuesBySprint = (
  sprintId: number | undefined
): Promise<Issue[]> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/issuesBySprint?sprint=${sprintId}`)
    .then((issues) => issues.json())
    .catch((err) => err)

export const getBacklogIssues = (
  projectKey: string | undefined,
  boardId: number
): Promise<Issue[]> =>
  fetch(
    `${
      import.meta.env.VITE_EXTENDER
    }/backlogIssuesByProjectAndBoard?project=${projectKey}&boardId=${boardId}`
  )
    .then((issues) => issues.json())
    .catch((err) => err)

export const createSprint = (sprint: SprintCreate): Promise<void> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/createSprint`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sprint }),
  })
    .then(() => {})
    .catch((err) => err)
