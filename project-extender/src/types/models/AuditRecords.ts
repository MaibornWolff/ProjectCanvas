/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AuditRecordBean } from "./AuditRecordBean"

/**
 * Container for a list of audit records.
 */
export type AuditRecords = {
  /**
   * The number of audit items skipped before the first item in this list.
   */
  readonly offset?: number
  /**
   * The requested or default limit on the number of audit items to be returned.
   */
  readonly limit?: number
  /**
   * The total number of audit items returned.
   */
  readonly total?: number
  /**
   * The list of audit items.
   */
  readonly records?: Array<AuditRecordBean>
}
