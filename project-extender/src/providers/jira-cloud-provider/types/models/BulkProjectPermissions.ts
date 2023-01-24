/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Details of project permissions and associated issues and projects to look up.
 */
export type BulkProjectPermissions = {
  /**
   * List of issue IDs.
   */
  issues?: Array<number>
  /**
   * List of project IDs.
   */
  projects?: Array<number>
  /**
   * List of project permissions.
   */
  permissions: Array<string>
}
