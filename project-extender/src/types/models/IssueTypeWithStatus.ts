/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StatusDetails } from "./StatusDetails"

/**
 * Status details for an issue type.
 */
export type IssueTypeWithStatus = {
  /**
   * The URL of the issue type's status details.
   */
  readonly self: string
  /**
   * The ID of the issue type.
   */
  readonly id: string
  /**
   * The name of the issue type.
   */
  readonly name: string
  /**
   * Whether this issue type represents subtasks.
   */
  readonly subtask: boolean
  /**
   * List of status details for the issue type.
   */
  readonly statuses: Array<StatusDetails>
}
