/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectIdentifierBean } from "./ProjectIdentifierBean"

/**
 * A list of projects in which a user is granted permissions.
 */
export type PermittedProjects = {
  /**
   * A list of projects.
   */
  readonly projects?: Array<ProjectIdentifierBean>
}
