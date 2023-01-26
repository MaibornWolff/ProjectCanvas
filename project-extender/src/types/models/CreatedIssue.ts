/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NestedResponse } from "./NestedResponse"

/**
 * Details about a created issue or subtask.
 */
export type CreatedIssue = {
  /**
   * The ID of the created issue or subtask.
   */
  readonly id?: string
  /**
   * The key of the created issue or subtask.
   */
  readonly key?: string
  /**
   * The URL of the created issue or subtask.
   */
  readonly self?: string
  /**
   * The response code and messages related to any requested transition.
   */
  readonly transition?: NestedResponse
  /**
   * The response code and messages related to any requested watchers.
   */
  readonly watchers?: NestedResponse
}
