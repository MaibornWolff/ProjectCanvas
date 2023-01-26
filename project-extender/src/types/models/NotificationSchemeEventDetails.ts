/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NotificationSchemeEventTypeId } from "./NotificationSchemeEventTypeId"
import type { NotificationSchemeNotificationDetails } from "./NotificationSchemeNotificationDetails"

/**
 * Details of a notification scheme event.
 */
export type NotificationSchemeEventDetails = {
  /**
   * The ID of the event.
   */
  event: NotificationSchemeEventTypeId
  /**
   * The list of notifications mapped to a specified event.
   */
  notifications: Array<NotificationSchemeNotificationDetails>
}
