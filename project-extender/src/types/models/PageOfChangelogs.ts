/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Changelog } from "./Changelog"

/**
 * A page of changelogs.
 */
export type PageOfChangelogs = {
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
   * The list of changelogs.
   */
  readonly histories?: Array<Changelog>
}
