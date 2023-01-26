/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JqlQueryClauseTimePredicate } from "./JqlQueryClauseTimePredicate"
import type { JqlQueryField } from "./JqlQueryField"

/**
 * A clause that asserts whether a field was changed. For example, `status CHANGED AFTER startOfMonth(-1M)`.See [CHANGED](https://confluence.atlassian.com/x/dgiiLQ#Advancedsearching-operatorsreference-CHANGEDCHANGED) for more information about the CHANGED operator.
 */
export type FieldChangedClause = {
  field: JqlQueryField
  /**
   * The operator applied to the field.
   */
  operator: "changed"
  /**
   * The list of time predicates.
   */
  predicates: Array<JqlQueryClauseTimePredicate>
}
