/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FieldLastUsed } from "./FieldLastUsed"
import type { JsonTypeBean } from "./JsonTypeBean"

/**
 * Details of a field.
 */
export type Field = {
  /**
   * The ID of the field.
   */
  id: string
  /**
   * The name of the field.
   */
  name: string
  schema: JsonTypeBean
  /**
   * The description of the field.
   */
  description?: string
  /**
   * The key of the field.
   */
  key?: string
  /**
   * Whether the field is locked.
   */
  isLocked?: boolean
  /**
   * Whether the field is shown on screen or not.
   */
  isUnscreenable?: boolean
  /**
   * The searcher key of the field. Returned for custom fields.
   */
  searcherKey?: string
  /**
   * Number of screens where the field is used.
   */
  screensCount?: number
  /**
   * Number of contexts where the field is used.
   */
  contextsCount?: number
  /**
   * Number of projects where the field is used.
   */
  projectsCount?: number
  lastUsed?: FieldLastUsed
}
