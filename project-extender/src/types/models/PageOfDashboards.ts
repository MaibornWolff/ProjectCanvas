/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Dashboard } from "./Dashboard"

/**
 * A page containing dashboard details.
 */
export type PageOfDashboards = {
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
   * The URL of the previous page of results, if any.
   */
  readonly prev?: string
  /**
   * The URL of the next page of results, if any.
   */
  readonly next?: string
  /**
   * List of dashboards.
   */
  readonly dashboards?: Array<Dashboard>
}
