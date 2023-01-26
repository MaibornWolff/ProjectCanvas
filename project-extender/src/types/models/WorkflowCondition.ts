/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WorkflowCompoundCondition } from "./WorkflowCompoundCondition"
import type { WorkflowSimpleCondition } from "./WorkflowSimpleCondition"

/**
 * The workflow transition rule conditions tree.
 */
export type WorkflowCondition =
  | WorkflowSimpleCondition
  | WorkflowCompoundCondition
