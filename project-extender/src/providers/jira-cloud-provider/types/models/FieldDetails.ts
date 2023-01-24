/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonTypeBean } from "./JsonTypeBean"
import type { Scope } from "./Scope"

/**
 * Details about a field.
 */
export type FieldDetails = {
  /**
   * The ID of the field.
   */
  id?: string
  /**
   * The key of the field.
   */
  key?: string
  /**
   * The name of the field.
   */
  name?: string
  /**
   * Whether the field is a custom field.
   */
  custom?: boolean
  /**
   * Whether the content of the field can be used to order lists.
   */
  orderable?: boolean
  /**
   * Whether the field can be used as a column on the issue navigator.
   */
  navigable?: boolean
  /**
   * Whether the content of the field can be searched.
   */
  searchable?: boolean
  /**
   * The names that can be used to reference the field in an advanced search. For more information, see [Advanced searching - fields reference](https://confluence.atlassian.com/x/gwORLQ).
   */
  clauseNames?: Array<string>
  /**
   * The scope of the field.
   */
  scope?: Scope
  /**
   * The data schema for the field.
   */
  schema?: JsonTypeBean
}
