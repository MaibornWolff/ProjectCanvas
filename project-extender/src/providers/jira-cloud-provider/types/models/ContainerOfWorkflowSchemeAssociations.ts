/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WorkflowSchemeAssociations } from "./WorkflowSchemeAssociations"

/**
 * A container for a list of workflow schemes together with the projects they are associated with.
 */
export type ContainerOfWorkflowSchemeAssociations = {
  /**
   * A list of workflow schemes together with projects they are associated with.
   */
  values: Array<WorkflowSchemeAssociations>
}
