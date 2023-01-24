/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Details of how to filter and list search auto complete information.
 */
export type SearchAutoCompleteFilter = {
  /**
   * List of project IDs used to filter the visible field details returned.
   */
  projectIds?: Array<number>
  /**
   * Include collapsed fields for fields that have non-unique names.
   */
  includeCollapsedFields?: boolean
}
