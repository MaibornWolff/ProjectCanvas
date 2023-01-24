/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserDetails } from "./UserDetails"

/**
 * A paged list. To access additional details append `[start-index:end-index]` to the expand request. For example, `?expand=sharedUsers[10:40]` returns a list starting at item 10 and finishing at item 40.
 */
export type PagedListUserDetailsApplicationUser = {
  /**
   * The number of items on the page.
   */
  readonly size?: number
  /**
   * The list of items.
   */
  readonly items?: Array<UserDetails>
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
