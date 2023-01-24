/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JqlQueryToSanitize } from "./JqlQueryToSanitize"

/**
 * The list of JQL queries to sanitize for the given account IDs.
 */
export type JqlQueriesToSanitize = {
  /**
   * The list of JQL queries to sanitize. Must contain unique values. Maximum of 20 queries.
   */
  queries: Array<JqlQueryToSanitize>
}
