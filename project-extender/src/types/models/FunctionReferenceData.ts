/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Details of functions that can be used in advanced searches.
 */
export type FunctionReferenceData = {
  /**
   * The function identifier.
   */
  value?: string
  /**
   * The display name of the function.
   */
  displayName?: string
  /**
   * Whether the function can take a list of arguments.
   */
  isList?: "true" | "false"
  /**
   * The data types returned by the function.
   */
  types?: Array<string>
}
