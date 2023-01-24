/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IssueLinkType } from "./IssueLinkType"
import type { LinkedIssue } from "./LinkedIssue"

/**
 * Details of a link between issues.
 */
export type IssueLink = {
  /**
   * The ID of the issue link.
   */
  readonly id?: string
  /**
   * The URL of the issue link.
   */
  readonly self?: string
  /**
   * The type of link between the issues.
   */
  type: IssueLinkType
  /**
   * Provides details about the linked issue. If presenting this link in a user interface, use the `inward` field of the issue link type to label the link.
   */
  inwardIssue: LinkedIssue
  /**
   * Provides details about the linked issue. If presenting this link in a user interface, use the `outward` field of the issue link type to label the link.
   */
  outwardIssue: LinkedIssue
}
