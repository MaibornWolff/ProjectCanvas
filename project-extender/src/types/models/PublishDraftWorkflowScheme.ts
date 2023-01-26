/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StatusMapping } from "./StatusMapping"

/**
 * Details about the status mappings for publishing a draft workflow scheme.
 */
export type PublishDraftWorkflowScheme = {
  /**
   * Mappings of statuses to new statuses for issue types.
   */
  statusMappings?: Array<StatusMapping>
}
