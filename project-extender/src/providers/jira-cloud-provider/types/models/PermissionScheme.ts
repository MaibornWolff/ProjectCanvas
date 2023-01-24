/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PermissionGrant } from "./PermissionGrant"
import type { Scope } from "./Scope"

/**
 * Details of a permission scheme.
 */
export type PermissionScheme = {
  /**
   * The expand options available for the permission scheme.
   */
  readonly expand?: string
  /**
   * The ID of the permission scheme.
   */
  readonly id?: number
  /**
   * The URL of the permission scheme.
   */
  readonly self?: string
  /**
   * The name of the permission scheme. Must be unique.
   */
  name: string
  /**
   * A description for the permission scheme.
   */
  description?: string
  /**
   * The scope of the permission scheme.
   */
  scope?: Scope
  /**
   * The permission scheme to create or update. See [About permission schemes and grants](../api-group-permission-schemes/#about-permission-schemes-and-grants) for more information.
   */
  permissions?: Array<PermissionGrant>
}
