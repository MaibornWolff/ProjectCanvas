/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GroupName } from "./GroupName"

/**
 * Details of an application role.
 */
export type ApplicationRole = {
  /**
   * The key of the application role.
   */
  key?: string
  /**
   * The groups associated with the application role. As a group's name can change, use of `groupDetails` is recommended to identify a groups.
   */
  groups?: Array<string>
  /**
   * The groups associated with the application role.
   */
  groupDetails?: Array<GroupName>
  /**
   * The display name of the application role.
   */
  name?: string
  /**
   * The groups that are granted default access for this application role. As a group's name can change, use of `defaultGroupsDetails` is recommended to identify a groups.
   */
  defaultGroups?: Array<string>
  /**
   * The groups that are granted default access for this application role.
   */
  defaultGroupsDetails?: Array<GroupName>
  /**
   * Determines whether this application role should be selected by default on user creation.
   */
  selectedByDefault?: boolean
  /**
   * Deprecated.
   */
  defined?: boolean
  /**
   * The maximum count of users on your license.
   */
  numberOfSeats?: number
  /**
   * The count of users remaining on your license.
   */
  remainingSeats?: number
  /**
   * The number of users counting against your license.
   */
  userCount?: number
  /**
   * The [type of users](https://confluence.atlassian.com/x/lRW3Ng) being counted against your license.
   */
  userCountDescription?: string
  hasUnlimitedSeats?: boolean
  /**
   * Indicates if the application role belongs to Jira platform (`jira-core`).
   */
  platform?: boolean
}
