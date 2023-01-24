/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IssuePickerSuggestionsIssueType } from "./IssuePickerSuggestionsIssueType"

/**
 * A list of issues suggested for use in auto-completion.
 */
export type IssuePickerSuggestions = {
  /**
   * A list of issues for an issue type suggested for use in auto-completion.
   */
  readonly sections?: Array<IssuePickerSuggestionsIssueType>
}
