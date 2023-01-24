/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NotificationSchemeEvent } from "./NotificationSchemeEvent"
import type { Scope } from "./Scope"

/**
 * Details about a notification scheme.
 */
export type NotificationScheme = {
  /**
   * Expand options that include additional notification scheme details in the response.
   */
  expand?: string
  /**
   * The ID of the notification scheme.
   */
  id?: number
  self?: string
  /**
   * The name of the notification scheme.
   */
  name?: string
  /**
   * The description of the notification scheme.
   */
  description?: string
  /**
   * The notification events and associated recipients.
   */
  notificationSchemeEvents?: Array<NotificationSchemeEvent>
  /**
   * The scope of the notification scheme.
   */
  scope?: Scope
  /**
   * The list of project IDs associated with the notification scheme.
   */
  projects?: Array<number>
}
