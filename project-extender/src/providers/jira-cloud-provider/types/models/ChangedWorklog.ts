/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityProperty } from "./EntityProperty"

/**
 * Details of a changed worklog.
 */
export type ChangedWorklog = {
  /**
   * The ID of the worklog.
   */
  readonly worklogId?: number
  /**
   * The datetime of the change.
   */
  readonly updatedTime?: number
  /**
   * Details of properties associated with the change.
   */
  readonly properties?: Array<EntityProperty>
}
