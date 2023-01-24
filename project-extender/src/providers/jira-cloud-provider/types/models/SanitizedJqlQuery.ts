/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ErrorCollection } from "./ErrorCollection"

/**
 * Details of the sanitized JQL query.
 */
export type SanitizedJqlQuery = {
  /**
   * The initial query.
   */
  initialQuery?: string
  /**
   * The sanitized query, if there were no errors.
   */
  sanitizedQuery?: string | null
  /**
   * The list of errors.
   */
  errors?: ErrorCollection
  /**
   * The account ID of the user for whom sanitization was performed.
   */
  accountId?: string | null
}
