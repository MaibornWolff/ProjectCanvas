import { Issue, IssueType, User } from "project-extender"

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

export const createNewIssue = (issue: Issue) =>
  fetch(`${import.meta.env.VITE_EXTENDER}/createIssue`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ issue }),
  }).catch((err) => err)
