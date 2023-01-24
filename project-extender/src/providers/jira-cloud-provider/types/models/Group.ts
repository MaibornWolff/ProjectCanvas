/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PagedListUserDetailsApplicationUser } from "./PagedListUserDetailsApplicationUser"

export type Group = {
  /**
   * The name of group.
   */
  name?: string
  /**
   * The ID of the group, which uniquely identifies the group across all Atlassian products. For example, *952d12c3-5b5b-4d04-bb32-44d383afc4b2*.
   */
  groupId?: string | null
  /**
   * The URL for these group details.
   */
  readonly self?: string
  /**
   * A paginated list of the users that are members of the group. A maximum of 50 users is returned in the list, to access additional users append `[start-index:end-index]` to the expand request. For example, to access the next 50 users, use`?expand=users[51:100]`.
   */
  readonly users?: PagedListUserDetailsApplicationUser
  /**
   * Expand options that include additional group details in the response.
   */
  readonly expand?: string
}
