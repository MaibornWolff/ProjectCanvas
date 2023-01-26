/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Application } from "./Application"
import type { RemoteObject } from "./RemoteObject"

/**
 * Details of an issue remote link.
 */
export type RemoteIssueLink = {
  /**
   * The ID of the link.
   */
  id?: number
  /**
   * The URL of the link.
   */
  self?: string
  /**
   * The global ID of the link, such as the ID of the item on the remote system.
   */
  globalId?: string
  /**
   * Details of the remote application the linked item is in.
   */
  application?: Application
  /**
   * Description of the relationship between the issue and the linked item.
   */
  relationship?: string
  /**
   * Details of the item linked to.
   */
  object?: RemoteObject
}
