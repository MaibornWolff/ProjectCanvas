/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LicensedApplication } from "./LicensedApplication"

/**
 * Details about a license for the Jira instance.
 */
export type License = {
  /**
   * The applications under this license.
   */
  readonly applications: Array<LicensedApplication>
}
