/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PermissionGrant } from "./PermissionGrant"

/**
 * List of permission grants.
 */
export type PermissionGrants = {
  /**
   * Permission grants list.
   */
  readonly permissions?: Array<PermissionGrant>
  /**
   * Expand options that include additional permission grant details in the response.
   */
  readonly expand?: string
}
