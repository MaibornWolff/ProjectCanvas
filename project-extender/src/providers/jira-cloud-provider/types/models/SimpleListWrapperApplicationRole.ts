/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ApplicationRole } from "./ApplicationRole"
import type { ListWrapperCallbackApplicationRole } from "./ListWrapperCallbackApplicationRole"

export type SimpleListWrapperApplicationRole = {
  size?: number
  items?: Array<ApplicationRole>
  pagingCallback?: ListWrapperCallbackApplicationRole
  callback?: ListWrapperCallbackApplicationRole
  "max-results"?: number
}
