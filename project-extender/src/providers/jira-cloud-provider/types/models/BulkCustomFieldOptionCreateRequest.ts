/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CustomFieldOptionCreate } from "./CustomFieldOptionCreate"

/**
 * Details of the options to create for a custom field.
 */
export type BulkCustomFieldOptionCreateRequest = {
  /**
   * Details of options to create.
   */
  options?: Array<CustomFieldOptionCreate>
}
