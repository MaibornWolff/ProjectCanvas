/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ChangeDetails } from "./ChangeDetails"
import type { HistoryMetadata } from "./HistoryMetadata"
import type { UserDetails } from "./UserDetails"

/**
 * A changelog.
 */
export type Changelog = {
  /**
   * The ID of the changelog.
   */
  readonly id?: string
  /**
   * The user who made the change.
   */
  readonly author?: UserDetails
  /**
   * The date on which the change took place.
   */
  readonly created?: string
  /**
   * The list of items changed.
   */
  readonly items?: Array<ChangeDetails>
  /**
   * The history metadata associated with the changed.
   */
  readonly historyMetadata?: HistoryMetadata
}
