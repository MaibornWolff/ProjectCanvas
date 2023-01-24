/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectDetails } from "./ProjectDetails"
import type { PublishedWorkflowId } from "./PublishedWorkflowId"
import type { Transition } from "./Transition"
import type { WorkflowOperations } from "./WorkflowOperations"
import type { WorkflowSchemeIdName } from "./WorkflowSchemeIdName"
import type { WorkflowStatus } from "./WorkflowStatus"

/**
 * Details about a workflow.
 */
export type Workflow = {
  id: PublishedWorkflowId
  /**
   * The description of the workflow.
   */
  description: string
  /**
   * The transitions of the workflow.
   */
  transitions?: Array<Transition>
  /**
   * The statuses of the workflow.
   */
  statuses?: Array<WorkflowStatus>
  /**
   * Whether this is the default workflow.
   */
  isDefault?: boolean
  /**
   * The workflow schemes the workflow is assigned to.
   */
  schemes?: Array<WorkflowSchemeIdName>
  /**
   * The projects the workflow is assigned to, through workflow schemes.
   */
  projects?: Array<ProjectDetails>
  /**
   * Whether the workflow has a draft version.
   */
  hasDraftWorkflow?: boolean
  operations?: WorkflowOperations
  /**
   * The creation date of the workflow.
   */
  created?: string
  /**
   * The last edited date of the workflow.
   */
  updated?: string
}
