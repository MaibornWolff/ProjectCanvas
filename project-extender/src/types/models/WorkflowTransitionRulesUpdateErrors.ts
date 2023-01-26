/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WorkflowTransitionRulesUpdateErrorDetails } from "./WorkflowTransitionRulesUpdateErrorDetails"

/**
 * Details of any errors encountered while updating workflow transition rules.
 */
export type WorkflowTransitionRulesUpdateErrors = {
  /**
   * A list of workflows.
   */
  updateResults: Array<WorkflowTransitionRulesUpdateErrorDetails>
}
