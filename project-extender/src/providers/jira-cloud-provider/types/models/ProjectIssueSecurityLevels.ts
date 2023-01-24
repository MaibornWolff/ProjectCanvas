/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SecurityLevel } from "./SecurityLevel"

/**
 * List of issue level security items in a project.
 */
export type ProjectIssueSecurityLevels = {
  /**
   * Issue level security items list.
   */
  readonly levels: Array<SecurityLevel>
}
