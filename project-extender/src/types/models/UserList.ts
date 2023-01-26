/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { User } from "./User"

/**
 * A paginated list of users sharing the filter. This includes users that are members of the groups or can browse the projects that the filter is shared with.
 */
export type UserList = {
  /**
   * The number of items on the page.
   */
  readonly size?: number
  /**
   * The list of items.
   */
  readonly items?: Array<User>
  /**
   * The maximum number of results that could be on the page.
   */
  readonly "max-results"?: number
  /**
   * The index of the first item returned on the page.
   */
  readonly "start-index"?: number
  /**
   * The index of the last item returned on the page.
   */
  readonly "end-index"?: number
}
