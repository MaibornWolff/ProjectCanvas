/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FunctionOperand } from "./FunctionOperand"
import type { KeywordOperand } from "./KeywordOperand"
import type { ValueOperand } from "./ValueOperand"

/**
 * An operand that can be part of a list operand.
 */
export type JqlQueryUnitaryOperand =
  | ValueOperand
  | FunctionOperand
  | KeywordOperand
