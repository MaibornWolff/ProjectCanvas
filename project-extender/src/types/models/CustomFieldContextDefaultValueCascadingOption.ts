/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The default value for a cascading select custom field.
 */
export type CustomFieldContextDefaultValueCascadingOption = {
  /**
   * The ID of the context.
   */
  contextId: string
  /**
   * The ID of the default option.
   */
  optionId: string
  /**
   * The ID of the default cascading option.
   */
  cascadingOptionId?: string
  type: "option.cascading"
}
