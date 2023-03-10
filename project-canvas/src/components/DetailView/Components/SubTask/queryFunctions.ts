export const deleteIssueSubtask = (issueIdOrKey: string): Promise<void> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/deleteIssue`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ issueIdOrKey }),
  })
    .then(() => {})
    .catch((err) => err)
