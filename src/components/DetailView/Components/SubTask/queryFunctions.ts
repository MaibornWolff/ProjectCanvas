export const deleteIssueSubtask = (issueIdOrKey: string): Promise<void> =>
  window.provider.deleteIssue(issueIdOrKey);
