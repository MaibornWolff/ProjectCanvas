/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Fields } from "./Fields"

/**
 * The ID or key of a linked issue.
 */
export type LinkedIssue = {
  /**
   * The ID of an issue. Required if `key` isn't provided.
   */
  id?: string
  /**
   * The key of an issue. Required if `id` isn't provided.
   */
  key?: string
  /**
   * The URL of the issue.
   */
  readonly self?: string
  /**
   * The fields associated with the issue.
   */
  readonly fields?: Fields
}
