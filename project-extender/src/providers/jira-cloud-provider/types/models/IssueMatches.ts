/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IssueMatchesForJQL } from "./IssueMatchesForJQL"

/**
 * A list of matched issues or errors for each JQL query, in the order the JQL queries were passed.
 */
export type IssueMatches = {
  matches: Array<IssueMatchesForJQL>
}
