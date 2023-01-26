/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FieldReferenceData } from "./FieldReferenceData"
import type { FunctionReferenceData } from "./FunctionReferenceData"

/**
 * Lists of JQL reference data.
 */
export type JQLReferenceData = {
  /**
   * List of fields usable in JQL queries.
   */
  visibleFieldNames?: Array<FieldReferenceData>
  /**
   * List of functions usable in JQL queries.
   */
  visibleFunctionNames?: Array<FunctionReferenceData>
  /**
   * List of JQL query reserved words.
   */
  jqlReservedWords?: Array<string>
}
