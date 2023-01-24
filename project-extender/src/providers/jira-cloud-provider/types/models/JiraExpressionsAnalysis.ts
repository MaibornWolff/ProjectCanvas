/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JiraExpressionAnalysis } from "./JiraExpressionAnalysis"

/**
 * Details about the analysed Jira expression.
 */
export type JiraExpressionsAnalysis = {
  /**
   * The results of Jira expressions analysis.
   */
  results: Array<JiraExpressionAnalysis>
}
