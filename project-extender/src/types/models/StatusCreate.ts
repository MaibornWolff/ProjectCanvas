/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Details of the status being created.
 */
export type StatusCreate = {
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
