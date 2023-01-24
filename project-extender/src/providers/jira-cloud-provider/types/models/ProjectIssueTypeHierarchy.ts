/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectIssueTypesHierarchyLevel } from "./ProjectIssueTypesHierarchyLevel"

/**
 * The hierarchy of issue types within a project.
 */
export type ProjectIssueTypeHierarchy = {
  /**
   * The ID of the project.
   */
  readonly projectId?: number
  /**
   * Details of an issue type hierarchy level.
   */
  readonly hierarchy?: Array<ProjectIssueTypesHierarchyLevel>
}
