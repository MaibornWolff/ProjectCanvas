/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ErrorCollection } from "./ErrorCollection"

export type BulkOperationErrorResult = {
  status?: number
  elementErrors?: ErrorCollection
  failedElementNumber?: number
}
