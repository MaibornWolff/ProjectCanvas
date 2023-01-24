/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IssueTypeInfo } from "./IssueTypeInfo"

/**
 * Details of an issue type hierarchy level.
 */
export type ProjectIssueTypesHierarchyLevel = {
  /**
   * The ID of the issue type hierarchy level. This property is deprecated, see [Change notice: Removing hierarchy level IDs from next-gen APIs](https://developer.atlassian.com/cloud/jira/platform/change-notice-removing-hierarchy-level-ids-from-next-gen-apis/).
   */
  readonly entityId?: string
  /**
   * The level of the issue type hierarchy level.
   */
  readonly level?: number
  /**
   * The name of the issue type hierarchy level.
   */
  readonly name?: string
  /**
   * The list of issue types in the hierarchy level.
   */
  readonly issueTypes?: Array<IssueTypeInfo>
}
