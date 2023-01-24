/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CustomFieldContext } from "./CustomFieldContext"

/**
 * A page of items.
 */
export type PageBeanCustomFieldContext = {
  /**
   * The URL of the page.
   */
  readonly self?: string
  /**
   * If there is another page of results, the URL of the next page.
   */
  readonly nextPage?: string
  /**
   * The maximum number of items that could be returned.
   */
  readonly maxResults?: number
  /**
   * The index of the first item returned.
   */
  readonly startAt?: number
  /**
   * The number of items returned.
   */
  readonly total?: number
  /**
   * Whether this is the last page.
   */
  readonly isLast?: boolean
  /**
   * The list of items.
   */
  readonly values?: Array<CustomFieldContext>
}
