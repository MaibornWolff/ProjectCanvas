/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * An operand that is a function. See [Advanced searching - functions reference](https://confluence.atlassian.com/x/dwiiLQ) for more information about JQL functions.
 */
export type FunctionOperand = {
  /**
   * The name of the function.
   */
  function: string
  /**
   * The list of function arguments.
   */
  arguments: Array<string>
}
