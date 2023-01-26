/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JiraStatus } from "./JiraStatus"

export type PageOfStatuses = {
  /**
   * The index of the first item returned on the page.
   */
  startAt?: number
  /**
   * Number of items that satisfy the search.
   */
  total?: number
  /**
   * Whether this is the last page.
   */
  isLast?: boolean
  /**
   * The maximum number of items that could be returned.
   */
  maxResults?: number
  /**
   * The list of items.
   */
  values?: Array<JiraStatus>
  /**
   * The URL of this page.
   */
  self?: string
  /**
   * The URL of the next page of results, if any.
   */
  nextPage?: string
}
