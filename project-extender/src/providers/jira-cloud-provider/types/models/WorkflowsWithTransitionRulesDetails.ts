/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WorkflowTransitionRulesDetails } from "./WorkflowTransitionRulesDetails"

/**
 * Details of workflows and their transition rules to delete.
 */
export type WorkflowsWithTransitionRulesDetails = {
  /**
   * The list of workflows with transition rules to delete.
   */
  workflows: Array<WorkflowTransitionRulesDetails>
}
