/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BulkOperationErrorResult } from "./BulkOperationErrorResult"
import type { CreatedIssue } from "./CreatedIssue"

/**
 * Details about the issues created and the errors for requests that failed.
 */
export type CreatedIssues = {
  /**
   * Details of the issues created.
   */
  readonly issues?: Array<CreatedIssue>
  /**
   * Error details for failed issue creation requests.
   */
  readonly errors?: Array<BulkOperationErrorResult>
}
