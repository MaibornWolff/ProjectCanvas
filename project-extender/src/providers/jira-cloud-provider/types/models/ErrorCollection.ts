/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Error messages from an operation.
 */
export type ErrorCollection = {
  /**
   * The list of error messages produced by this operation. For example, "input parameter 'key' must be provided"
   */
  errorMessages?: Array<string>
  /**
   * The list of errors by parameter returned by the operation. For example,"projectKey": "Project keys must start with an uppercase letter, followed by one or more uppercase alphanumeric characters."
   */
  errors?: Record<string, string>
  status?: number
}
