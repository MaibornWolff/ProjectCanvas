/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Avatar } from "./Avatar"

/**
 * List of project avatars.
 */
export type ProjectAvatars = {
  /**
   * List of avatars included with Jira. These avatars cannot be deleted.
   */
  readonly system?: Array<Avatar>
  /**
   * List of avatars added to Jira. These avatars may be deleted.
   */
  readonly custom?: Array<Avatar>
}
