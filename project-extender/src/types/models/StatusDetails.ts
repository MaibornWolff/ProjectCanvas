/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StatusCategory } from "./StatusCategory"

/**
 * A status.
 */
export type StatusDetails = {
  /**
   * The URL of the status.
   */
  readonly self?: string
  /**
   * The description of the status.
   */
  readonly description?: string
  /**
   * The URL of the icon used to represent the status.
   */
  readonly iconUrl?: string
  /**
   * The name of the status.
   */
  readonly name?: string
  /**
   * The ID of the status.
   */
  readonly id?: string
  /**
   * The category assigned to the status.
   */
  readonly statusCategory?: StatusCategory
}
