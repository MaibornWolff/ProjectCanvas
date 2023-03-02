import { Issue } from "project-extender"

export const editIssue = (issue: Issue, issueIdOrKey: string): Promise<void> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/editIssue`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ issue, issueIdOrKey }),
  })
    .then(() => {})
    .catch((err) => err)
