/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IssueTypeScreenSchemeMapping } from "./IssueTypeScreenSchemeMapping"

/**
 * The details of an issue type screen scheme.
 */
export type IssueTypeScreenSchemeDetails = {
  /**
   * The name of the issue type screen scheme. The name must be unique. The maximum length is 255 characters.
   */
  name: string
  /**
   * The description of the issue type screen scheme. The maximum length is 255 characters.
   */
  description?: string
  /**
   * The IDs of the screen schemes for the issue type IDs and *default*. A *default* entry is required to create an issue type screen scheme, it defines the mapping for all issue types without a screen scheme.
   */
  issueTypeMappings: Array<IssueTypeScreenSchemeMapping>
}
