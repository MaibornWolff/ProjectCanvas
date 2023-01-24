/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WorkflowId } from "./WorkflowId"

/**
 * Details about a workflow configuration update request.
 */
export type WorkflowTransitionRulesDetails = {
  workflowId: WorkflowId
  /**
   * The list of connect workflow rule IDs.
   */
  workflowRuleIds: Array<string>
}
