/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SimpleErrorCollection } from "./SimpleErrorCollection"

export type RemoveOptionFromIssuesResult = {
  /**
   * The IDs of the modified issues.
   */
  modifiedIssues?: Array<number>
  /**
   * The IDs of the unchanged issues, those issues where errors prevent modification.
   */
  unmodifiedIssues?: Array<number>
  /**
   * A collection of errors related to unchanged issues. The collection size is limited, which means not all errors may be returned.
   */
  errors?: SimpleErrorCollection
}
