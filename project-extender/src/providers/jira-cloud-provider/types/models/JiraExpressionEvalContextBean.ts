/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CustomContextVariable } from "./CustomContextVariable"
import type { IdOrKeyBean } from "./IdOrKeyBean"
import type { JexpIssues } from "./JexpIssues"

export type JiraExpressionEvalContextBean = {
  /**
   * The issue that is available under the `issue` variable when evaluating the expression.
   */
  issue?: IdOrKeyBean
  /**
   * The collection of issues that is available under the `issues` variable when evaluating the expression.
   */
  issues?: JexpIssues
  /**
   * The project that is available under the `project` variable when evaluating the expression.
   */
  project?: IdOrKeyBean
  /**
   * The ID of the sprint that is available under the `sprint` variable when evaluating the expression.
   */
  sprint?: number
  /**
   * The ID of the board that is available under the `board` variable when evaluating the expression.
   */
  board?: number
  /**
   * The ID of the service desk that is available under the `serviceDesk` variable when evaluating the expression.
   */
  serviceDesk?: number
  /**
   * The ID of the customer request that is available under the `customerRequest` variable when evaluating the expression. This is the same as the ID of the underlying Jira issue, but the customer request context variable will have a different type.
   */
  customerRequest?: number
  /**
   * Custom context variables and their types. These variable types are available for use in a custom context:
   *
   * *  `user`: A [user](https://developer.atlassian.com/cloud/jira/platform/jira-expressions-type-reference#user) specified as an Atlassian account ID.
   * *  `issue`: An [issue](https://developer.atlassian.com/cloud/jira/platform/jira-expressions-type-reference#issue) specified by ID or key. All the fields of the issue object are available in the Jira expression.
   * *  `json`: A JSON object containing custom content.
   * *  `list`: A JSON list of `user`, `issue`, or `json` variable types.
   */
  custom?: Array<CustomContextVariable>
}
