/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectIssueCreateMetadata } from "./ProjectIssueCreateMetadata"

/**
 * The wrapper for the issue creation metadata for a list of projects.
 */
export type IssueCreateMetadata = {
  /**
   * Expand options that include additional project details in the response.
   */
  readonly expand?: string
  /**
   * List of projects and their issue creation metadata.
   */
  readonly projects?: Array<ProjectIssueCreateMetadata>
}
