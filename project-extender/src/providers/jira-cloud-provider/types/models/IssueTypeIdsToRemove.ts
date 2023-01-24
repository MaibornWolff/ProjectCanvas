/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The list of issue type IDs to be removed from the field configuration scheme.
 */
export type IssueTypeIdsToRemove = {
  /**
   * The list of issue type IDs. Must contain unique values not longer than 255 characters and not be empty. Maximum of 100 IDs.
   */
  issueTypeIds: Array<string>
}
