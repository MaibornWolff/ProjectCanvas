/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * List of project permissions and the projects and issues those permissions grant access to.
 */
export type BulkProjectPermissionGrants = {
  /**
   * A project permission,
   */
  permission: string
  /**
   * IDs of the issues the user has the permission for.
   */
  issues: Array<number>
  /**
   * IDs of the projects the user has the permission for.
   */
  projects: Array<number>
}
