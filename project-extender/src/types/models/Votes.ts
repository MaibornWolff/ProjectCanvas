/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { User } from "./User"

/**
 * The details of votes on an issue.
 */
export type Votes = {
  /**
   * The URL of these issue vote details.
   */
  readonly self?: string
  /**
   * The number of votes on the issue.
   */
  readonly votes?: number
  /**
   * Whether the user making this request has voted on the issue.
   */
  readonly hasVoted?: boolean
  /**
   * List of the users who have voted on this issue. An empty list is returned when the calling user doesn't have the *View voters and watchers* project permission.
   */
  readonly voters?: Array<User>
}
