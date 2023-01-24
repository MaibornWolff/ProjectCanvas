/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BulkProjectPermissionGrants } from "./BulkProjectPermissionGrants"

/**
 * Details of global and project permissions granted to the user.
 */
export type BulkPermissionGrants = {
  /**
   * List of project permissions and the projects and issues those permissions provide access to.
   */
  projectPermissions: Array<BulkProjectPermissionGrants>
  /**
   * List of permissions granted to the user.
   */
  globalPermissions: Array<string>
}
