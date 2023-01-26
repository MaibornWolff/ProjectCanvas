/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Avatar } from "./Avatar"

/**
 * Details about system and custom avatars.
 */
export type Avatars = {
  /**
   * System avatars list.
   */
  readonly system?: Array<Avatar>
  /**
   * Custom avatars list.
   */
  readonly custom?: Array<Avatar>
}
