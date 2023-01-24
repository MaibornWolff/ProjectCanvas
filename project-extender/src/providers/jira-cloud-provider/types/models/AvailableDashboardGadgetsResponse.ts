/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AvailableDashboardGadget } from "./AvailableDashboardGadget"

/**
 * The list of available gadgets.
 */
export type AvailableDashboardGadgetsResponse = {
  /**
   * The list of available gadgets.
   */
  readonly gadgets: Array<AvailableDashboardGadget>
}
