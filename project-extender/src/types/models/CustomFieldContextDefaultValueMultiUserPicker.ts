/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The default value for a User Picker (multiple) custom field.
 */
export type CustomFieldContextDefaultValueMultiUserPicker = {
  /**
   * The ID of the context.
   */
  contextId: string
  /**
   * The IDs of the default users.
   */
  accountIds: Array<string>
  type: "multi.user.select"
}
