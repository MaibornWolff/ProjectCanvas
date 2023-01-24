/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Details of the permission.
 */
export type RestrictedPermission = {
  /**
   * The ID of the permission. Either `id` or `key` must be specified. Use [Get all permissions](#api-rest-api-3-permissions-get) to get the list of permissions.
   */
  id?: string
  /**
   * The key of the permission. Either `id` or `key` must be specified. Use [Get all permissions](#api-rest-api-3-permissions-get) to get the list of permissions.
   */
  key?: string
}
