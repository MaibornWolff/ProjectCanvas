/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A container for the watch status of a list of issues.
 */
export type BulkIssueIsWatching = {
  /**
   * The map of issue ID to boolean watch status.
   */
  readonly issuesIsWatching?: Record<string, boolean>
}
