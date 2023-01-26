/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Scope } from "./Scope"

/**
 * Details about an issue type.
 */
export type IssueTypeDetails = {
  /**
   * The URL of these issue type details.
   */
  readonly self?: string
  /**
   * The ID of the issue type.
   */
  readonly id?: string
  /**
   * The description of the issue type.
   */
  readonly description?: string
  /**
   * The URL of the issue type's avatar.
   */
  readonly iconUrl?: string
  /**
   * The name of the issue type.
   */
  readonly name?: string
  /**
   * Whether this issue type is used to create subtasks.
   */
  readonly subtask?: boolean
  /**
   * The ID of the issue type's avatar.
   */
  readonly avatarId?: number
  /**
   * Unique ID for next-gen projects.
   */
  readonly entityId?: string
  /**
   * Hierarchy level of the issue type.
   */
  readonly hierarchyLevel?: number
  /**
   * Details of the next-gen projects the issue type is available in.
   */
  readonly scope?: Scope
}
