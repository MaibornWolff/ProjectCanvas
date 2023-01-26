/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IssueTypeScreenSchemeMapping } from "./IssueTypeScreenSchemeMapping"

/**
 * A list of issue type screen scheme mappings.
 */
export type IssueTypeScreenSchemeMappingDetails = {
  /**
   * The list of issue type to screen scheme mappings. A *default* entry cannot be specified because a default entry is added when an issue type screen scheme is created.
   */
  issueTypeMappings: Array<IssueTypeScreenSchemeMapping>
}
