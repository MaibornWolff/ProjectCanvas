import { IssueType } from "project-extender"

export const createSubtask = (
  parentIssueKey: string,
  subtaskSummary: string,
  projectId: string,
  subtaskIssueTypeId: string
): Promise<{ id: string; key: string }> =>
  new Promise((resolve) => {
    fetch(`${import.meta.env.VITE_EXTENDER}/createSubtask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parentIssueKey,
        subtaskSummary,
        projectId,
        subtaskIssueTypeId,
      }),
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
