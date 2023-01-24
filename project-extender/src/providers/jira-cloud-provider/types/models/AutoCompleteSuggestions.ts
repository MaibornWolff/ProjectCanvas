/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AutoCompleteSuggestion } from "./AutoCompleteSuggestion"

/**
 * The results from a JQL query.
 */
export type AutoCompleteSuggestions = {
  /**
   * The list of suggested item.
   */
  results?: Array<AutoCompleteSuggestion>
}
