import { IssueType } from "project-extender"

export const createSubtask = (
  parentIssueKey: string,
  summary: string,
  projectId: string,
  subtaskID: string
): Promise<{ id: string; key: string }> =>
  new Promise((resolve) => {
    fetch(`${import.meta.env.VITE_EXTENDER}/createSubtask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parentIssueKey, summary, projectId, subtaskID }),
    }).then(async (createdSubtask) => {
      resolve(await createdSubtask.json())
    })
  })

export const getIssueTypes = (projectIdOrKey: string): Promise<IssueType[]> =>
  fetch(
    `${
      import.meta.env.VITE_EXTENDER
    }/issueTypesByProject?projectIdOrKey=${projectIdOrKey}`
  )
    .then((issueTypes) => issueTypes.json())
    .catch((err) => err)
