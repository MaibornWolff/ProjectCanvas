/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ScreenTypes } from "./ScreenTypes"

/**
 * Details of a screen scheme.
 */
export type ScreenSchemeDetails = {
  /**
   * The name of the screen scheme. The name must be unique. The maximum length is 255 characters.
   */
  name: string
  /**
   * The description of the screen scheme. The maximum length is 255 characters.
   */
  description?: string
  /**
   * The IDs of the screens for the screen types of the screen scheme. Only screens used in classic projects are accepted.
   */
  screens: ScreenTypes
}
