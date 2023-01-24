/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A workflow transition rule.
 */
export type CreateWorkflowTransitionRule = {
  /**
   * The type of the transition rule.
   */
  type: string
  /**
   * EXPERIMENTAL. The configuration of the transition rule.
   */
  configuration?: Record<string, any>
}
