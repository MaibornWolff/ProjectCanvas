/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IssueBean } from "./IssueBean"
import type { JsonTypeBean } from "./JsonTypeBean"

/**
 * The result of a JQL search.
 */
export type SearchResults = {
  /**
   * Expand options that include additional search result details in the response.
   */
  readonly expand?: string
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
   * The list of issues found by the search.
   */
  readonly issues?: Array<IssueBean>
  /**
   * Any warnings related to the JQL query.
   */
  readonly warningMessages?: Array<string>
  /**
   * The ID and name of each field in the search results.
   */
  readonly names?: Record<string, string>
  /**
   * The schema describing the field types in the search results.
   */
  readonly schema?: Record<string, JsonTypeBean>
}
