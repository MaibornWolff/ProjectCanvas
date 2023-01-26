/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The default value for a Date custom field.
 */
export type CustomFieldContextDefaultValueDate = {
  /**
   * The default date in ISO format. Ignored if `useCurrent` is true.
   */
  date?: string
  /**
   * Whether to use the current date.
   */
  useCurrent?: boolean
  type: "datepicker"
}
