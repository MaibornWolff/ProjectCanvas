/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Details of a notification within a notification scheme.
 */
export type NotificationSchemeNotificationDetails = {
  /**
   * The notification type, e.g `CurrentAssignee`, `Group`, `EmailAddress`.
   */
  notificationType: string
  /**
   * The value corresponding to the specified notification type.
   */
  parameter?: string
}
