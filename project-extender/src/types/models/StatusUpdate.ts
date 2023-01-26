/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Details of the status being updated.
 */
export type StatusUpdate = {
  /**
   * The ID of the status.
   */
  id: string
  /**
   * The name of the status.
   */
  name: string
  /**
   * The category of the status.
   */
  statusCategory: "TODO" | "IN_PROGRESS" | "DONE"
  /**
   * The description of the status.
   */
  description?: string
}
