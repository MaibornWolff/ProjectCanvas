/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ChangedWorklog } from "./ChangedWorklog"

/**
 * List of changed worklogs.
 */
export type ChangedWorklogs = {
  /**
   * Changed worklog list.
   */
  readonly values?: Array<ChangedWorklog>
  /**
   * The datetime of the first worklog item in the list.
   */
  readonly since?: number
  /**
   * The datetime of the last worklog item in the list.
   */
  readonly until?: number
  /**
   * The URL of this changed worklogs list.
   */
  readonly self?: string
  /**
   * The URL of the next list of changed worklogs.
   */
  readonly nextPage?: string
  lastPage?: boolean
}
