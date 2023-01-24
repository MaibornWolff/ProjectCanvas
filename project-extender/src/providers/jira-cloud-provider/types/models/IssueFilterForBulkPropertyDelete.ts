/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Bulk operation filter details.
 */
export type IssueFilterForBulkPropertyDelete = {
  /**
   * List of issues to perform the bulk delete operation on.
   */
  entityIds?: Array<number>
  /**
   * The value of properties to perform the bulk operation on.
   */
  currentValue?: any
}
