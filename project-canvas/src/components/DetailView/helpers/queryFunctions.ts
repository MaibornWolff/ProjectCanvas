import { Issue } from "types"

export const editIssue = (issue: Issue, issueIdOrKey: string): Promise<void> =>
  window.provider.editIssue(issue, issueIdOrKey)
