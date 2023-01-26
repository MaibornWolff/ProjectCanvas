/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NotificationRecipients } from "./NotificationRecipients"
import type { NotificationRecipientsRestrictions } from "./NotificationRecipientsRestrictions"

/**
 * Details about a notification.
 */
export type Notification = {
  /**
   * The subject of the email notification for the issue. If this is not specified, then the subject is set to the issue key and summary.
   */
  subject?: string
  /**
   * The plain text body of the email notification for the issue.
   */
  textBody?: string
  /**
   * The HTML body of the email notification for the issue.
   */
  htmlBody?: string
  /**
   * The recipients of the email notification for the issue.
   */
  to?: NotificationRecipients
  /**
   * Restricts the notifications to users with the specified permissions.
   */
  restrict?: NotificationRecipientsRestrictions
}
