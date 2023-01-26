/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Mapping of an issue type to a context.
 */
export type IssueTypeToContextMapping = {
  /**
   * The ID of the context.
   */
  contextId: string
  /**
   * The ID of the issue type.
   */
  issueTypeId?: string
  /**
   * Whether the context is mapped to any issue type.
   */
  isAnyIssueType?: boolean
}
