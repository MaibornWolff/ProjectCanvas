/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JqlQueryClauseOperand } from "./JqlQueryClauseOperand"
import type { JqlQueryClauseTimePredicate } from "./JqlQueryClauseTimePredicate"
import type { JqlQueryField } from "./JqlQueryField"

/**
 * A clause that asserts a previous value of a field. For example, `status WAS "Resolved" BY currentUser() BEFORE "2019/02/02"`. See [WAS](https://confluence.atlassian.com/x/dgiiLQ#Advancedsearching-operatorsreference-WASWAS) for more information about the WAS operator.
 */
export type FieldWasClause = {
  field: JqlQueryField
  /**
   * The operator between the field and operand.
   */
  operator: "was" | "was in" | "was not in" | "was not"
  operand: JqlQueryClauseOperand
  /**
   * The list of time predicates.
   */
  predicates: Array<JqlQueryClauseTimePredicate>
}
