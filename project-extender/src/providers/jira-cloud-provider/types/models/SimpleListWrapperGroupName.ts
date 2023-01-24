/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GroupName } from "./GroupName"
import type { ListWrapperCallbackGroupName } from "./ListWrapperCallbackGroupName"

export type SimpleListWrapperGroupName = {
  size?: number
  items?: Array<GroupName>
  pagingCallback?: ListWrapperCallbackGroupName
  callback?: ListWrapperCallbackGroupName
  "max-results"?: number
}
