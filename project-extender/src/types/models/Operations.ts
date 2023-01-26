/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LinkGroup } from "./LinkGroup"

/**
 * Details of the operations that can be performed on the issue.
 */
export type Operations = {
  /**
   * Details of the link groups defining issue operations.
   */
  readonly linkGroups?: Array<LinkGroup>
}
