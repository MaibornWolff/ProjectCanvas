/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Comment } from "./Comment"

export type PaginatedResponseComment = {
  maxResults?: number
  startAt?: number
  total?: number
  results?: Array<Comment>
}
