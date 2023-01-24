/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IssueTransition } from "./IssueTransition"

/**
 * List of issue transitions.
 */
export type Transitions = {
  /**
   * Expand options that include additional transitions details in the response.
   */
  readonly expand?: string
  /**
   * List of issue transitions.
   */
  readonly transitions?: Array<IssueTransition>
}
