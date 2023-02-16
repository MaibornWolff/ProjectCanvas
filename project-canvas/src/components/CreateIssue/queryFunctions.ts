import { Issue, IssueType, User, Sprint, Priority } from "project-extender"

export const getIssueTypes = (projectIdOrKey: string): Promise<IssueType[]> =>
  fetch(
    `${
      import.meta.env.VITE_EXTENDER
    }/issueTypesByProject?projectIdOrKey=${projectIdOrKey}`
  )
    .then((issueTypes) => issueTypes.json())
    .catch((err) => err)

export const getAssignableUsersByProject = (
  projectIdOrKey: string
): Promise<User[]> =>
  fetch(
    `${
      import.meta.env.VITE_EXTENDER
    }/assignableUsersByProject?projectIdOrKey=${projectIdOrKey}`
  )
    .then((users) => users.json())
    .catch((err) => err)

export const createNewIssue = (issue: Issue): Promise<string> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/createIssue`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ issue }),
  })
    .then((issueKey) => issueKey.json())
    .catch((err) => err)

export const getEpicsByProject = (projectIdOrKey: string): Promise<Issue[]> =>
  fetch(
    `${
      import.meta.env.VITE_EXTENDER
    }/epicsByProject?projectIdOrKey=${projectIdOrKey}`
  )
    .then((epics) => epics.json())
    .catch((err) => err)

export const getBoardIds = (projectIdOrKey: string): Promise<number[]> =>
  fetch(
    `${
      import.meta.env.VITE_EXTENDER
    }/boardIdsByProject?project=${projectIdOrKey}`
  )
    .then((boards) => boards.json())
    .catch((err) => err)

export const getSprints = (boardId: number): Promise<Sprint[]> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/sprintsByBoardId?boardId=${boardId}`)
    .then((sprints) => sprints.json())
    .catch((err) => err)

export const getLabels = (): Promise<string[]> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/labels`)
    .then((labels) => labels.json())
    .catch((err) => err)

export const getCurrentUser = (): Promise<User> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/currentUser`)
    .then((user) => user.json())
    .catch((err) => err)

export const getPriorities = (): Promise<Priority[]> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/priorities`)
    .then((priorities) => priorities.json())
    .catch((err) => err)

export const getIssueTypesWithFieldsMap = (): Promise<Map<string, string[]>> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/issueTypesWithFieldsMap`)
    .then(async (mapResponse) => {
      const resp: { [key: string]: string[] } = await mapResponse.json()
      const map = new Map<string, string[]>()
      Object.entries(resp).forEach(([key, value]) => map.set(key, value))
      return map
    })
    .catch((err) => err)
