/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserPermission } from "./UserPermission"

/**
 * Details about permissions.
 */
export type Permissions = {
  /**
   * List of permissions.
   */
  readonly permissions?: Record<string, UserPermission>
}
