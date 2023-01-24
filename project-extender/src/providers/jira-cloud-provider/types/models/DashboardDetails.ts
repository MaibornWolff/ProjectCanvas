/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SharePermission } from "./SharePermission"

/**
 * Details of a dashboard.
 */
export type DashboardDetails = {
  /**
   * The name of the dashboard.
   */
  name: string
  /**
   * The description of the dashboard.
   */
  description?: string
  /**
   * The share permissions for the dashboard.
   */
  sharePermissions: Array<SharePermission>
  /**
   * The edit permissions for the dashboard.
   */
  editPermissions: Array<SharePermission>
}
