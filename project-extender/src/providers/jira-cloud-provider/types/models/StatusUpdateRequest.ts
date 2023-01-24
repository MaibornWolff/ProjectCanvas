/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StatusUpdate } from "./StatusUpdate"

/**
 * The list of statuses that will be updated.
 */
export type StatusUpdateRequest = {
  /**
   * The list of statuses that will be updated.
   */
  statuses?: Array<StatusUpdate>
}
