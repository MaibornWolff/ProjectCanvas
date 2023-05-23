import { Issue, IssueType, Priority, Sprint, User } from "project-extender"

export const getIssueTypes = (projectIdOrKey: string): Promise<IssueType[]> =>
  window.provider.getIssueTypesByProject(projectIdOrKey)

export const createIssue = (issue: Issue): Promise<string> =>
  window.provider.createIssue(issue)

export const moveIssueToBacklog = (issueIdOrKey: string): Promise<void> =>
  window.provider.moveIssueToBacklog(issueIdOrKey)

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

export const getBoardIds = (projectIdOrKey: string): Promise<number[]> =>
  window.provider.getBoardIds(projectIdOrKey)

export const getSprints = (boardId: number): Promise<Sprint[]> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/sprintsByBoardId?boardId=${boardId}`)
    .then((sprints) => sprints.json())
    .catch((err) => err)

export const getLabels = (): Promise<string[]> => window.provider.getLabels()

export const getCurrentUser = (): Promise<User> =>
  window.provider.getCurrentUser()

export const getPriorities = (): Promise<Priority[]> =>
  window.provider.getPriorities()

export const getIssueTypesWithFieldsMap = (): Promise<Map<string, string[]>> =>
  window.provider.getIssueTypesWithFieldsMap().then(async (mapResponse) => {
    const map = new Map<string, string[]>()
    Object.entries(mapResponse).forEach(([key, value]) => map.set(key, value))
    return map
  })

export const setStatus = (
  issueKey: string,
  targetStatus: string
): Promise<void> =>
  fetch(
    `${
      import.meta.env.VITE_EXTENDER
    }/setStatus?issueKey=${issueKey}&targetStatus=${targetStatus} `
  ).then(() => {})

export const getIssueReporter = (issueIdOrKey: string): Promise<User> =>
  window.provider.getIssueReporter(issueIdOrKey)

export const getEditableIssueFields = (
  issueIdOrKey: string
): Promise<string[]> => window.provider.getEditableIssueFields(issueIdOrKey)

export const getEpicsByProject = (projectIdOrKey: string): Promise<Issue[]> =>
  fetch(
    `${
      import.meta.env.VITE_EXTENDER
    }/epicsByProject?projectIdOrKey=${projectIdOrKey}`
  )
    .then((epics) => epics.json())
    .catch((err) => err)
