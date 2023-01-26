/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JqlQueryClause } from "./JqlQueryClause"
import type { JqlQueryOrderByClause } from "./JqlQueryOrderByClause"

/**
 * A parsed JQL query.
 */
export type JqlQuery = {
  where?: JqlQueryClause
  orderBy?: JqlQueryOrderByClause
}
