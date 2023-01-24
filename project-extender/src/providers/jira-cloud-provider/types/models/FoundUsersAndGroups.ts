/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FoundGroups } from "./FoundGroups"
import type { FoundUsers } from "./FoundUsers"

/**
 * List of users and groups found in a search.
 */
export type FoundUsersAndGroups = {
  users?: FoundUsers
  groups?: FoundGroups
}
