import { Issue, Sprint } from "project-extender"

export const getIssues = async (
  projectKey: string | undefined,
  boardIds: number[],
  updateColumn: (t1: string, t2: { id: string; list: Issue[] }) => void,
  updateSprints: (key: string, value: Sprint) => void,
  setIsLoading: (val: boolean) => void
) => {
  await Promise.all(
    boardIds.map(async (boardId) => {
      const sprintsResponse = await fetch(
        `${import.meta.env.VITE_EXTENDER}/sprintsByBoardId?boardId=${boardId}`
      )
      const sprintsAsArray = await sprintsResponse.json()
      await Promise.all(
        sprintsAsArray.map(async (sprint: Sprint) => {
          updateSprints(sprint.name, {
            id: sprint.id,
            name: sprint.name,
            state: sprint.state,
            startDate: sprint.startDate,
            endDate: sprint.endDate,
          })
          const issuesForSprintResponse = await fetch(
            `${import.meta.env.VITE_EXTENDER}/issuesBySprintAndProject?sprint=${
              sprint.id
            }&project=${projectKey}`
          )
          const issuesForSprints = await issuesForSprintResponse.json()
          updateColumn(sprint.name, {
            id: sprint.name,
            list: issuesForSprints.filter(
              (issue: Issue) =>
                issue.type !== "Epic" && issue.type !== "Subtask"
            ),
          })
        })
      )
      const backlogIssues = await fetch(
        `${
          import.meta.env.VITE_EXTENDER
        }/backlogIssuesByProjectAndBoard?project=${projectKey}&boardId=${boardId}`
      )
      const unassignedIssues = await backlogIssues.json()
      updateColumn("Backlog", {
        id: "Backlog",
        list: unassignedIssues.filter(
          (issue: Issue) => issue.type !== "Epic" && issue.type !== "Subtask"
        ),
      })
    })
  )
  setIsLoading(false)
}

// export const getSprints = (boardIds: number[]) => {
//   const sprintsData = boardIds.map(async (boardId) =>
//     fetch(
//       `${import.meta.env.VITE_EXTENDER}/sprintsByBoardId?boardId=${boardId}`
//     ).then((sprint) => sprint.json())
//   )
//   return Promise.all(sprintsData).then((sprints) => sprints)
// }

export const getSprints = (boardId: number): Promise<Sprint[]> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/sprintsByBoardId?boardId=${boardId}`)
    .then((sprints) => sprints.json())
    .catch((err) => err)

export const getIssuesBySprint = (
  projectKey: string | undefined,
  sprintId: number | undefined
): Promise<Issue[]> => {
  if (typeof projectKey === "undefined")
    return Promise.reject(new Error("Invalid Project Key"))

  if (typeof sprintId === "undefined")
    return Promise.reject(new Error("Invalid Sprint id"))

  return fetch(
    `${
      import.meta.env.VITE_EXTENDER
    }/issuesBySprintAndProject?sprint=${sprintId}&project=${projectKey}`
  )
    .then((issues) => issues.json())
    .catch((err) => err)
}

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
