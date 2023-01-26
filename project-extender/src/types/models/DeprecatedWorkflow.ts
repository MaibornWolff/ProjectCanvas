/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Scope } from "./Scope"

/**
 * Details about a workflow.
 */
export type DeprecatedWorkflow = {
  /**
   * The name of the workflow.
   */
  readonly name?: string
  /**
   * The description of the workflow.
   */
  readonly description?: string
  /**
   * The datetime the workflow was last modified.
   */
  readonly lastModifiedDate?: string
  /**
   * This property is no longer available and will be removed from the documentation soon. See the [deprecation notice](https://developer.atlassian.com/cloud/jira/platform/deprecation-notice-user-privacy-api-migration-guide/) for details.
   */
  readonly lastModifiedUser?: string
  /**
   * The account ID of the user that last modified the workflow.
   */
  readonly lastModifiedUserAccountId?: string
  /**
   * The number of steps included in the workflow.
   */
  readonly steps?: number
  /**
   * The scope where this workflow applies
   */
  readonly scope?: Scope
  default?: boolean
}
