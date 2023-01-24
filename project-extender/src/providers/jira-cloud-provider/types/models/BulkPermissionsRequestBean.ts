/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BulkProjectPermissions } from "./BulkProjectPermissions"

/**
 * Details of global permissions to look up and project permissions with associated projects and issues to look up.
 */
export type BulkPermissionsRequestBean = {
  /**
   * Project permissions with associated projects and issues to look up.
   */
  projectPermissions?: Array<BulkProjectPermissions>
  /**
   * Global permissions to look up.
   */
  globalPermissions?: Array<string>
  /**
   * The account ID of a user.
   */
  accountId?: string
}
