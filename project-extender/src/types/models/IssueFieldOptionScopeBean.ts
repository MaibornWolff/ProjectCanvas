/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GlobalScopeBean } from "./GlobalScopeBean"
import type { ProjectScopeBean } from "./ProjectScopeBean"

export type IssueFieldOptionScopeBean = {
  /**
   * DEPRECATED
   */
  projects?: Array<number>
  /**
   * Defines the projects in which the option is available and the behavior of the option within each project. Specify one object per project. The behavior of the option in a project context overrides the behavior in the global context.
   */
  projects2?: Array<ProjectScopeBean>
  /**
   * Defines the behavior of the option within the global context. If this property is set, even if set to an empty object, then the option is available in all projects.
   */
  global?: GlobalScopeBean
}
