/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Count of a version's unresolved issues.
 */
export type VersionUnresolvedIssuesCount = {
  /**
   * The URL of these count details.
   */
  readonly self?: string
  /**
   * Count of unresolved issues.
   */
  readonly issuesUnresolvedCount?: number
  /**
   * Count of issues.
   */
  readonly issuesCount?: number
}
