/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Counts of the number of issues in various statuses.
 */
export type VersionIssuesStatus = {
  /**
   * Count of issues with a status other than *to do*, *in progress*, and *done*.
   */
  readonly unmapped?: number
  /**
   * Count of issues with status *to do*.
   */
  readonly toDo?: number
  /**
   * Count of issues with status *in progress*.
   */
  readonly inProgress?: number
  /**
   * Count of issues with status *done*.
   */
  readonly done?: number
}
