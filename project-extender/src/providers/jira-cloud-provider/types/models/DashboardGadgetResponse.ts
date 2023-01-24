/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DashboardGadget } from "./DashboardGadget"

/**
 * The list of gadgets on the dashboard.
 */
export type DashboardGadgetResponse = {
  /**
   * The list of gadgets.
   */
  readonly gadgets: Array<DashboardGadget>
}
