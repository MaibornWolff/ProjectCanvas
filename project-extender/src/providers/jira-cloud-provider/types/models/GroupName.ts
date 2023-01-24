/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Details about a group.
 */
export type GroupName = {
  /**
   * The name of group.
   */
  name?: string
  /**
   * The ID of the group, which uniquely identifies the group across all Atlassian products. For example, *952d12c3-5b5b-4d04-bb32-44d383afc4b2*.
   */
  groupId?: string | null
  /**
   * The URL for these group details.
   */
  readonly self?: string
}
