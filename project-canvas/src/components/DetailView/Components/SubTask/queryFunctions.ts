export const deleteIssueSubtask = (subtaskIssue: string): Promise<void> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/deleteSubtask`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subtaskIssue }),
  })
    .then(() => {})
    .catch((err) => err)
