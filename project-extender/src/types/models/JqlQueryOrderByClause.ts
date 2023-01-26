/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JqlQueryOrderByClauseElement } from "./JqlQueryOrderByClauseElement"

/**
 * Details of the order-by JQL clause.
 */
export type JqlQueryOrderByClause = {
  /**
   * The list of order-by clause fields and their ordering directives.
   */
  fields: Array<JqlQueryOrderByClauseElement>
}
