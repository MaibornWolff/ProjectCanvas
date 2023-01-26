/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserDetails } from "./UserDetails"

/**
 * The details of watchers on an issue.
 */
export type Watchers = {
  /**
   * The URL of these issue watcher details.
   */
  readonly self?: string
  /**
   * Whether the calling user is watching this issue.
   */
  readonly isWatching?: boolean
  /**
   * The number of users watching this issue.
   */
  readonly watchCount?: number
  /**
   * Details of the users watching this issue.
   */
  readonly watchers?: Array<UserDetails>
}
