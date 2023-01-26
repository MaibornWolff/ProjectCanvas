/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityProperty } from "./EntityProperty"
import type { FieldUpdateOperation } from "./FieldUpdateOperation"
import type { HistoryMetadata } from "./HistoryMetadata"
import type { IssueTransition } from "./IssueTransition"

/**
 * Details of an issue update request.
 */
export type IssueUpdateDetails = {
  /**
   * Details of a transition. Required when performing a transition, optional when creating or editing an issue.
   */
  transition?: IssueTransition
  /**
   * List of issue screen fields to update, specifying the sub-field to update and its value for each field. This field provides a straightforward option when setting a sub-field. When multiple sub-fields or other operations are required, use `update`. Fields included in here cannot be included in `update`.
   */
  fields?: Record<string, any>
  /**
   * A Map containing the field field name and a list of operations to perform on the issue screen field. Note that fields included in here cannot be included in `fields`.
   */
  update?: Record<string, Array<FieldUpdateOperation>>
  /**
   * Additional issue history details.
   */
  historyMetadata?: HistoryMetadata
  /**
   * Details of issue properties to be add or update.
   */
  properties?: Array<EntityProperty>
}
