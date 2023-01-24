/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FieldMetadata } from "./FieldMetadata"
import type { StatusDetails } from "./StatusDetails"

/**
 * Details of an issue transition.
 */
export type IssueTransition = {
  /**
   * The ID of the issue transition. Required when specifying a transition to undertake.
   */
  id?: string
  /**
   * The name of the issue transition.
   */
  readonly name?: string
  /**
   * Details of the issue status after the transition.
   */
  readonly to?: StatusDetails
  /**
   * Whether there is a screen associated with the issue transition.
   */
  readonly hasScreen?: boolean
  /**
   * Whether the issue transition is global, that is, the transition is applied to issues regardless of their status.
   */
  readonly isGlobal?: boolean
  /**
   * Whether this is the initial issue transition for the workflow.
   */
  readonly isInitial?: boolean
  /**
   * Whether the transition is available to be performed.
   */
  readonly isAvailable?: boolean
  /**
   * Whether the issue has to meet criteria before the issue transition is applied.
   */
  readonly isConditional?: boolean
  /**
   * Details of the fields associated with the issue transition screen. Use this information to populate `fields` and `update` in a transition request.
   */
  readonly fields?: Record<string, FieldMetadata>
  /**
   * Expand options that include additional transition details in the response.
   */
  readonly expand?: string
  looped?: boolean
}
