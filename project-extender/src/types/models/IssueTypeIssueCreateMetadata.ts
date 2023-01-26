/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FieldMetadata } from "./FieldMetadata"
import type { Scope } from "./Scope"

/**
 * Details of the issue creation metadata for an issue type.
 */
export type IssueTypeIssueCreateMetadata = {
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
  /**
   * Expand options that include additional issue type metadata details in the response.
   */
  readonly expand?: string
  /**
   * List of the fields available when creating an issue for the issue type.
   */
  readonly fields?: Record<string, FieldMetadata>
}
