/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WorkflowCondition } from "./WorkflowCondition"
import type { WorkflowTransitionRule } from "./WorkflowTransitionRule"

/**
 * A collection of transition rules.
 */
export type WorkflowRules = {
  conditionsTree?: WorkflowCondition
  /**
   * The workflow validators.
   */
  validators?: Array<WorkflowTransitionRule>
  /**
   * The workflow post functions.
   */
  postFunctions?: Array<WorkflowTransitionRule>
}
