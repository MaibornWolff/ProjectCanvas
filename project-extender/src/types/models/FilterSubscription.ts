/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GroupName } from "./GroupName"
import type { User } from "./User"

/**
 * Details of a user or group subscribing to a filter.
 */
export type FilterSubscription = {
  /**
   * The ID of the filter subscription.
   */
  readonly id?: number
  /**
   * The user subscribing to filter.
   */
  readonly user?: User
  /**
   * The group subscribing to filter.
   */
  readonly group?: GroupName
}
