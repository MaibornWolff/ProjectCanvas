/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GroupName } from "./GroupName"
import type { RestrictedPermission } from "./RestrictedPermission"

/**
 * Details of the group membership or permissions needed to receive the notification.
 */
export type NotificationRecipientsRestrictions = {
  /**
   * List of group memberships required to receive the notification.
   */
  groups?: Array<GroupName>
  /**
   * List of groupId memberships required to receive the notification.
   */
  groupIds?: Array<string>
  /**
   * List of permissions required to receive the notification.
   */
  permissions?: Array<RestrictedPermission>
}
