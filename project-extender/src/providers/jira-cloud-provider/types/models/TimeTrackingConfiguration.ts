/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Details of the time tracking configuration.
 */
export type TimeTrackingConfiguration = {
  /**
   * The number of hours in a working day.
   */
  workingHoursPerDay: number
  /**
   * The number of days in a working week.
   */
  workingDaysPerWeek: number
  /**
   * The format that will appear on an issue's *Time Spent* field.
   */
  timeFormat: "pretty" | "days" | "hours"
  /**
   * The default unit of time applied to logged time.
   */
  defaultUnit: "minute" | "hour" | "day" | "week"
}
