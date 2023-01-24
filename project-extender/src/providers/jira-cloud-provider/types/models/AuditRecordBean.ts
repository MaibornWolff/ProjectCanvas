/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AssociatedItemBean } from "./AssociatedItemBean"
import type { ChangedValueBean } from "./ChangedValueBean"

/**
 * An audit record.
 */
export type AuditRecordBean = {
  /**
   * The ID of the audit record.
   */
  readonly id?: number
  /**
   * The summary of the audit record.
   */
  readonly summary?: string
  /**
   * The URL of the computer where the creation of the audit record was initiated.
   */
  readonly remoteAddress?: string
  /**
   * Deprecated, use `authorAccountId` instead. The key of the user who created the audit record.
   */
  readonly authorKey?: string
  /**
   * The date and time on which the audit record was created.
   */
  readonly created?: string
  /**
   * The category of the audit record. For a list of these categories, see the help article [Auditing in Jira applications](https://confluence.atlassian.com/x/noXKM).
   */
  readonly category?: string
  /**
   * The event the audit record originated from.
   */
  readonly eventSource?: string
  /**
   * The description of the audit record.
   */
  readonly description?: string
  objectItem?: AssociatedItemBean
  /**
   * The list of values changed in the record event.
   */
  readonly changedValues?: Array<ChangedValueBean>
  /**
   * The list of items associated with the changed record.
   */
  readonly associatedItems?: Array<AssociatedItemBean>
}
