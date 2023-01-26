/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DashboardGadgetPosition } from "./DashboardGadgetPosition"

/**
 * The details of the gadget to update.
 */
export type DashboardGadgetUpdateRequest = {
  /**
   * The title of the gadget.
   */
  title?: string
  /**
   * The color of the gadget. Should be one of `blue`, `red`, `yellow`, `green`, `cyan`, `purple`, `gray`, or `white`.
   */
  color?: string
  /**
   * The position of the gadget.
   */
  position?: DashboardGadgetPosition
}
