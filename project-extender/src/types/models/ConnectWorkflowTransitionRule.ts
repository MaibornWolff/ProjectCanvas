/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RuleConfiguration } from "./RuleConfiguration"
import type { WorkflowTransition } from "./WorkflowTransition"

/**
 * A workflow transition rule.
 */
export type ConnectWorkflowTransitionRule = {
  /**
   * The ID of the transition rule.
   */
  id: string
  /**
   * The key of the rule, as defined in the Connect app descriptor.
   */
  readonly key: string
  configuration: RuleConfiguration
  readonly transition?: WorkflowTransition
}
