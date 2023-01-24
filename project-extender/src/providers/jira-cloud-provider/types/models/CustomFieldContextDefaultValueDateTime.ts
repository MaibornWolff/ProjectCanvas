/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The default value for a date time custom field.
 */
export type CustomFieldContextDefaultValueDateTime = {
  /**
   * The default date-time in ISO format. Ignored if `useCurrent` is true.
   */
  dateTime?: string
  /**
   * Whether to use the current date.
   */
  useCurrent?: boolean
  type: "datetimepicker"
}
