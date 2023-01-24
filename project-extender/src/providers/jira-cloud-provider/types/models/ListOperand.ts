/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JqlQueryUnitaryOperand } from "./JqlQueryUnitaryOperand"

/**
 * An operand that is a list of values.
 */
export type ListOperand = {
  /**
   * The list of operand values.
   */
  values: Array<JqlQueryUnitaryOperand>
}
