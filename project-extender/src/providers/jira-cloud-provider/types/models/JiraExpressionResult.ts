/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JiraExpressionEvaluationMetaDataBean } from "./JiraExpressionEvaluationMetaDataBean"

/**
 * The result of evaluating a Jira expression.
 */
export type JiraExpressionResult = {
  /**
   * The value of the evaluated expression. It may be a primitive JSON value or a Jira REST API object. (Some expressions do not produce any meaningful results—for example, an expression that returns a lambda function—if that's the case a simple string representation is returned. These string representations should not be relied upon and may change without notice.)
   */
  value: any
  /**
   * Contains various characteristics of the performed expression evaluation.
   */
  meta?: JiraExpressionEvaluationMetaDataBean
}
