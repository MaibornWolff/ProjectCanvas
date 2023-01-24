/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JqlQueryClauseOperand } from "./JqlQueryClauseOperand"
import type { JqlQueryField } from "./JqlQueryField"

/**
 * A clause that asserts the current value of a field. For example, `summary ~ test`.
 */
export type FieldValueClause = {
  field: JqlQueryField
  /**
   * The operator between the field and operand.
   */
  operator:
    | "="
    | "!="
    | ">"
    | "<"
    | ">="
    | "<="
    | "in"
    | "not in"
    | "~"
    | "~="
    | "is"
    | "is not"
  operand: JqlQueryClauseOperand
}
