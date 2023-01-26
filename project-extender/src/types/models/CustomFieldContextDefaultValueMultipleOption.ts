/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The default value for a multi-select custom field.
 */
export type CustomFieldContextDefaultValueMultipleOption = {
  /**
   * The ID of the context.
   */
  contextId: string
  /**
   * The list of IDs of the default options.
   */
  optionIds: Array<string>
  type: "option.multiple"
}
