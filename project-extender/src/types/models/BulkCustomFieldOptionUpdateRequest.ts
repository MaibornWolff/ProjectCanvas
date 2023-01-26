/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CustomFieldOptionUpdate } from "./CustomFieldOptionUpdate"

/**
 * Details of the options to update for a custom field.
 */
export type BulkCustomFieldOptionUpdateRequest = {
  /**
   * Details of the options to update.
   */
  options?: Array<CustomFieldOptionUpdate>
}
