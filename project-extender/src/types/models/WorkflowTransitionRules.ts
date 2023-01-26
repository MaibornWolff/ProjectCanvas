/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ConnectWorkflowTransitionRule } from "./ConnectWorkflowTransitionRule"
import type { WorkflowId } from "./WorkflowId"

/**
 * A workflow with transition rules.
 */
export type WorkflowTransitionRules = {
  workflowId: WorkflowId
  /**
   * The list of post functions within the workflow.
   */
  postFunctions?: Array<ConnectWorkflowTransitionRule>
  /**
   * The list of conditions within the workflow.
   */
  conditions?: Array<ConnectWorkflowTransitionRule>
  /**
   * The list of validators within the workflow.
   */
  validators?: Array<ConnectWorkflowTransitionRule>
}
