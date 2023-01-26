/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NotificationSchemeEventDetails } from "./NotificationSchemeEventDetails"

/**
 * Details of notifications which should be added to the notification scheme.
 */
export type AddNotificationsDetails = {
  /**
   * The list of notifications which should be added to the notification scheme.
   */
  notificationSchemeEvents: Array<NotificationSchemeEventDetails>
}
