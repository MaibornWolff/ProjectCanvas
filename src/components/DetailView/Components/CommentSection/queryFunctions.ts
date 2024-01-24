export const addCommentToIssue = (
  issueIdOrKey: string,
  commentText: string
): Promise<void> =>
  window.provider.addCommentToIssue(issueIdOrKey, commentText);

export const editIssueComment = (
  issueIdOrKey: string,
  commentId: string,
  commentText: string
): Promise<void> =>
  window.provider.editIssueComment(issueIdOrKey, commentId, commentText);

export const deleteIssueComment = (
  issueIdOrKey: string,
  commentId: string
): Promise<void> => window.provider.deleteIssueComment(issueIdOrKey, commentId);
