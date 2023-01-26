/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EventNotification } from "./EventNotification"
import type { NotificationEvent } from "./NotificationEvent"

/**
 * Details about a notification scheme event.
 */
export type NotificationSchemeEvent = {
  event?: NotificationEvent
  notifications?: Array<EventNotification>
}
