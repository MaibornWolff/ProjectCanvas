/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SanitizedJqlQuery } from "./SanitizedJqlQuery"

/**
 * The sanitized JQL queries for the given account IDs.
 */
export type SanitizedJqlQueries = {
  /**
   * The list of sanitized JQL queries.
   */
  queries?: Array<SanitizedJqlQuery>
}
