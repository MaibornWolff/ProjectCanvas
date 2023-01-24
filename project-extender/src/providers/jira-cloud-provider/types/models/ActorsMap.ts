/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ActorsMap = {
  /**
   * The user account ID of the user to add.
   */
  user?: Array<string>
  /**
   * The name of the group to add. This parameter cannot be used with the `groupId` parameter. As a group's name can change, use of `groupId` is recommended.
   */
  group?: Array<string>
  /**
   * The ID of the group to add. This parameter cannot be used with the `group` parameter.
   */
  groupId?: Array<string>
}
