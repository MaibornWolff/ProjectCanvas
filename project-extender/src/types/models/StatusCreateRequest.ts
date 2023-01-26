/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StatusCreate } from "./StatusCreate"
import type { StatusScope } from "./StatusScope"

/**
 * Details of the statuses being created and their scope.
 */
export type StatusCreateRequest = {
  /**
   * Details of the statuses being created.
   */
  statuses: Array<StatusCreate>
  scope: StatusScope
}
