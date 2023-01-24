/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectIssueTypes } from "./ProjectIssueTypes"
import type { StatusScope } from "./StatusScope"

/**
 * Details of a status.
 */
export type JiraStatus = {
  /**
   * The ID of the status.
   */
  id?: string
  /**
   * The name of the status.
   */
  name?: string
  /**
   * The category of the status.
   */
  statusCategory?: "TODO" | "IN_PROGRESS" | "DONE"
  scope?: StatusScope
  /**
   * The description of the status.
   */
  description?: string
  /**
   * Projects and issue types where the status is used. Only available if the `usages` expand is requested.
   */
  usages?: Array<ProjectIssueTypes>
}
