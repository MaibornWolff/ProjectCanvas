import { Issue } from "project-extender"

export const editIssue = (issue: Issue, issueIdOrKey: string): Promise<void> =>
  window.provider.editIssue(issue, issueIdOrKey)
