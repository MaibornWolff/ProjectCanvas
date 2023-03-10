export const addCommentToIssue = (
  issueIdOrKey: string,
  commentText: string
): Promise<void> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/addCommentToIssue`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ issueIdOrKey, commentText }),
  })
    .then(() => {})
    .catch((err) => err)

export const editIssueComment = (
  issueIdOrKey: string,
  commentId: string,
  commentText: string
): Promise<void> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/editIssueComment`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ issueIdOrKey, commentId, commentText }),
  })
    .then(() => {})
    .catch((err) => err)

export const deleteIssueComment = (
  issueIdOrKey: string,
  commentId: string
): Promise<void> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/deleteIssueComment`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ issueIdOrKey, commentId }),
  })
    .then(() => {})
    .catch((err) => err)
