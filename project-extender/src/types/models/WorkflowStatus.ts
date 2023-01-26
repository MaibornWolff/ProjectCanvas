/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Details of a workflow status.
 */
export type WorkflowStatus = {
  /**
   * The ID of the issue status.
   */
  id: string
  /**
   * The name of the status in the workflow.
   */
  name: string
  /**
   * Additional properties that modify the behavior of issues in this status. Supports the properties `jira.issue.editable` and `issueEditable` (deprecated) that indicate whether issues are editable.
   */
  properties?: Record<string, any>
}
