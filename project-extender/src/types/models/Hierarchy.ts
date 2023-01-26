/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SimplifiedHierarchyLevel } from "./SimplifiedHierarchyLevel"

/**
 * The project issue type hierarchy.
 */
export type Hierarchy = {
  /**
   * The ID of the base level. This property is deprecated, see [Change notice: Removing hierarchy level IDs from next-gen APIs](https://developer.atlassian.com/cloud/jira/platform/change-notice-removing-hierarchy-level-ids-from-next-gen-apis/).
   */
  baseLevelId?: number
  /**
   * Details about the hierarchy level.
   */
  readonly levels?: Array<SimplifiedHierarchyLevel>
}
