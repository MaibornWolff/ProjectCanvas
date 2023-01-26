/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JiraExpressionEvalContextBean } from "./JiraExpressionEvalContextBean"

export type JiraExpressionEvalRequestBean = {
  /**
   * The Jira expression to evaluate.
   */
  expression: string
  /**
   * The context in which the Jira expression is evaluated.
   */
  context?: JiraExpressionEvalContextBean
}
