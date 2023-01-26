/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IssueTypeDetails } from "./IssueTypeDetails"
import type { Priority } from "./Priority"
import type { StatusDetails } from "./StatusDetails"
import type { TimeTrackingDetails } from "./TimeTrackingDetails"
import type { UserDetails } from "./UserDetails"

/**
 * Key fields from the linked issue.
 */
export type Fields = {
  /**
   * The summary description of the linked issue.
   */
  readonly summary?: string
  /**
   * The status of the linked issue.
   */
  readonly status?: StatusDetails
  /**
   * The priority of the linked issue.
   */
  readonly priority?: Priority
  /**
   * The assignee of the linked issue.
   */
  readonly assignee?: UserDetails
  /**
   * The time tracking of the linked issue.
   */
  readonly timetracking?: TimeTrackingDetails
  /**
   * The type of the linked issue.
   */
  issuetype?: IssueTypeDetails
  /**
   * The type of the linked issue.
   */
  readonly issueType?: IssueTypeDetails
}
