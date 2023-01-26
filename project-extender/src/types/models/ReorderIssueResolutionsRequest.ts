/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Change the order of issue resolutions.
 */
export type ReorderIssueResolutionsRequest = {
  /**
   * The list of resolution IDs to be reordered. Cannot contain duplicates nor after ID.
   */
  ids: Array<string>
  /**
   * The ID of the resolution. Required if `position` isn't provided.
   */
  after?: string
  /**
   * The position for issue resolutions to be moved to. Required if `after` isn't provided.
   */
  position?: string
}
