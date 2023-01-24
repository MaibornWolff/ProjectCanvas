/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectId } from "./ProjectId"

/**
 * The scope of the status.
 */
export type StatusScope = {
  /**
   * The scope of the status. `GLOBAL` for company-managed projects and `PROJECT` for team-managed projects.
   */
  type: "PROJECT" | "GLOBAL"
  project?: ProjectId
}
