/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Bulk operation filter details.
 */
export type IssueFilterForBulkPropertySet = {
  /**
   * List of issues to perform the bulk operation on.
   */
  entityIds?: Array<number>
  /**
   * The value of properties to perform the bulk operation on.
   */
  currentValue?: any
  /**
   * Whether the bulk operation occurs only when the property is present on or absent from an issue.
   */
  hasProperty?: boolean
}
