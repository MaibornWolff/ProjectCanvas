/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FunctionOperand } from "./FunctionOperand"
import type { KeywordOperand } from "./KeywordOperand"
import type { ListOperand } from "./ListOperand"
import type { ValueOperand } from "./ValueOperand"

/**
 * Details of an operand in a JQL clause.
 */
export type JqlQueryClauseOperand =
  | ListOperand
  | ValueOperand
  | FunctionOperand
  | KeywordOperand
