/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JqlQueryClauseOperand } from "./JqlQueryClauseOperand"

/**
 * A time predicate for a temporal JQL clause.
 */
export type JqlQueryClauseTimePredicate = {
  /**
   * The operator between the field and the operand.
   */
  operator: "before" | "after" | "from" | "to" | "on" | "during" | "by"
  operand: JqlQueryClauseOperand
}
