/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Change the order of issue priorities.
 */
export type ReorderIssuePriorities = {
  /**
   * The list of issue IDs to be reordered. Cannot contain duplicates nor after ID.
   */
  ids: Array<string>
  /**
   * The ID of the priority. Required if `position` isn't provided.
   */
  after?: string
  /**
   * The position for issue priorities to be moved to. Required if `after` isn't provided.
   */
  position?: string
}
