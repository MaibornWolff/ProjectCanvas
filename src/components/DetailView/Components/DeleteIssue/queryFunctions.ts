export const deleteIssue = (issueIdOrKey: string): Promise<void> =>
  window.provider.deleteIssue(issueIdOrKey)
