/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NotificationSchemeEventDetails } from "./NotificationSchemeEventDetails"

/**
 * Details of an notification scheme.
 */
export type CreateNotificationSchemeDetails = {
  /**
   * The name of the notification scheme. Must be unique (case-insensitive).
   */
  name: string
  /**
   * The description of the notification scheme.
   */
  description?: string
  /**
   * The list of notifications which should be added to the notification scheme.
   */
  notificationSchemeEvents?: Array<NotificationSchemeEventDetails>
}
