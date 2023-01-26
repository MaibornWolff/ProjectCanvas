/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * An issue suggested for use in the issue picker auto-completion.
 */
export type SuggestedIssue = {
  /**
   * The ID of the issue.
   */
  readonly id?: number
  /**
   * The key of the issue.
   */
  readonly key?: string
  /**
   * The key of the issue in HTML format.
   */
  readonly keyHtml?: string
  /**
   * The URL of the issue type's avatar.
   */
  readonly img?: string
  /**
   * The phrase containing the query string in HTML format, with the string highlighted with HTML bold tags.
   */
  readonly summary?: string
  /**
   * The phrase containing the query string, as plain text.
   */
  readonly summaryText?: string
}
