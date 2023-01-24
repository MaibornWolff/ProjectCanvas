/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GroupName } from "./GroupName"
import type { UserDetails } from "./UserDetails"

/**
 * Details of the users and groups to receive the notification.
 */
export type NotificationRecipients = {
  /**
   * Whether the notification should be sent to the issue's reporter.
   */
  reporter?: boolean
  /**
   * Whether the notification should be sent to the issue's assignees.
   */
  assignee?: boolean
  /**
   * Whether the notification should be sent to the issue's watchers.
   */
  watchers?: boolean
  /**
   * Whether the notification should be sent to the issue's voters.
   */
  voters?: boolean
  /**
   * List of users to receive the notification.
   */
  users?: Array<UserDetails>
  /**
   * List of groups to receive the notification.
   */
  groups?: Array<GroupName>
  /**
   * List of groupIds to receive the notification.
   */
  groupIds?: Array<string>
}
