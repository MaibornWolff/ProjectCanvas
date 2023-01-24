/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WorkflowTransitionRules } from "./WorkflowTransitionRules"

/**
 * Details about a workflow configuration update request.
 */
export type WorkflowTransitionRulesUpdate = {
  /**
   * The list of workflows with transition rules to update.
   */
  workflows: Array<WorkflowTransitionRules>
}
