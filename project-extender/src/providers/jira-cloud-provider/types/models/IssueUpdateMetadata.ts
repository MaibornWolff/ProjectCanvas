/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FieldMetadata } from "./FieldMetadata"

/**
 * A list of editable field details.
 */
export type IssueUpdateMetadata = {
  readonly fields?: Record<string, FieldMetadata>
}
