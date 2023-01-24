/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Comment } from "./Comment"

/**
 * A page of comments.
 */
export type PageOfComments = {
  /**
   * The index of the first item returned.
   */
  readonly startAt?: number
  /**
   * The maximum number of items that could be returned.
   */
  readonly maxResults?: number
  /**
   * The number of items returned.
   */
  readonly total?: number
  /**
   * The list of comments.
   */
  readonly comments?: Array<Comment>
}
