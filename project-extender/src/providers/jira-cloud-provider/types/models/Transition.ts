/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TransitionScreenDetails } from "./TransitionScreenDetails"
import type { WorkflowRules } from "./WorkflowRules"

/**
 * Details of a workflow transition.
 */
export type Transition = {
  /**
   * The ID of the transition.
   */
  id: string
  /**
   * The name of the transition.
   */
  name: string
  /**
   * The description of the transition.
   */
  description: string
  /**
   * The statuses the transition can start from.
   */
  from: Array<string>
  /**
   * The status the transition goes to.
   */
  to: string
  /**
   * The type of the transition.
   */
  type: "global" | "initial" | "directed"
  screen?: TransitionScreenDetails
  rules?: WorkflowRules
  /**
   * The properties of the transition.
   */
  properties?: Record<string, any>
}
