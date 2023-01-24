/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A workflow transition rule condition. This object returns `nodeType` as `simple`.
 */
export type WorkflowSimpleCondition = {
  /**
   * The type of the transition rule.
   */
  type: string
  /**
   * EXPERIMENTAL. The configuration of the transition rule.
   */
  configuration?: any
  nodeType: "simple"
}
