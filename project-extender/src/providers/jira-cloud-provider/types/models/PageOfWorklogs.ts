/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Worklog } from "./Worklog"

/**
 * Paginated list of worklog details
 */
export type PageOfWorklogs = {
  /**
   * The index of the first item returned on the page.
   */
  readonly startAt?: number
  /**
   * The maximum number of results that could be on the page.
   */
  readonly maxResults?: number
  /**
   * The number of results on the page.
   */
  readonly total?: number
  /**
   * List of worklogs.
   */
  readonly worklogs?: Array<Worklog>
}
