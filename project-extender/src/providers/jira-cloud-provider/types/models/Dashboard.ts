/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SharePermission } from "./SharePermission"
import type { UserBean } from "./UserBean"

/**
 * Details of a dashboard.
 */
export type Dashboard = {
  description?: string
  /**
   * The ID of the dashboard.
   */
  readonly id?: string
  /**
   * Whether the dashboard is selected as a favorite by the user.
   */
  readonly isFavourite?: boolean
  /**
   * The name of the dashboard.
   */
  readonly name?: string
  /**
   * The owner of the dashboard.
   */
  readonly owner?: UserBean
  /**
   * The number of users who have this dashboard as a favorite.
   */
  readonly popularity?: number
  /**
   * The rank of this dashboard.
   */
  readonly rank?: number
  /**
   * The URL of these dashboard details.
   */
  readonly self?: string
  /**
   * The details of any view share permissions for the dashboard.
   */
  readonly sharePermissions?: Array<SharePermission>
  /**
   * The details of any edit share permissions for the dashboard.
   */
  readonly editPermissions?: Array<SharePermission>
  /**
   * The automatic refresh interval for the dashboard in milliseconds.
   */
  readonly automaticRefreshMs?: number
  /**
   * The URL of the dashboard.
   */
  readonly view?: string
  /**
   * Whether the current user has permission to edit the dashboard.
   */
  readonly isWritable?: boolean
  /**
   * Whether the current dashboard is system dashboard.
   */
  readonly systemDashboard?: boolean
}
