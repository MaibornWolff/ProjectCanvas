/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DashboardGadgetPosition } from "./DashboardGadgetPosition"

/**
 * Details of the settings for a dashboard gadget.
 */
export type DashboardGadgetSettings = {
  /**
   * The module key of the gadget type. Can't be provided with `uri`.
   */
  moduleKey?: string
  /**
   * The URI of the gadget type. Can't be provided with `moduleKey`.
   */
  uri?: string
  /**
   * The color of the gadget. Should be one of `blue`, `red`, `yellow`, `green`, `cyan`, `purple`, `gray`, or `white`.
   */
  color?: string
  /**
   * The position of the gadget. When the gadget is placed into the position, other gadgets in the same column are moved down to accommodate it.
   */
  position?: DashboardGadgetPosition
  /**
   * The title of the gadget.
   */
  title?: string
  /**
   * Whether to ignore the validation of module key and URI. For example, when a gadget is created that is a part of an application that isn't installed.
   */
  ignoreUriAndModuleKeyValidation?: boolean
}
