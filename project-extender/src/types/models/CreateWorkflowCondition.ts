/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A workflow transition condition.
 */
export type CreateWorkflowCondition = {
  /**
   * The compound condition operator.
   */
  operator?: "AND" | "OR"
  /**
   * The list of workflow conditions.
   */
  conditions?: Array<CreateWorkflowCondition>
  /**
   * The type of the transition rule.
   */
  type?: string
  /**
   * EXPERIMENTAL. The configuration of the transition rule.
   */
  configuration?: Record<string, any>
}
