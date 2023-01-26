/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The default value for a multiple version picker custom field.
 */
export type CustomFieldContextDefaultValueMultipleVersionPicker = {
  /**
   * The IDs of the default versions.
   */
  versionIds: Array<string>
  /**
   * The order the pickable versions are displayed in. If not provided, the released-first order is used. Available version orders are `"releasedFirst"` and `"unreleasedFirst"`.
   */
  versionOrder?: string
  type: "version.multiple"
}
