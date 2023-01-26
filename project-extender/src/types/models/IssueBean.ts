/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IncludedFields } from "./IncludedFields"
import type { IssueTransition } from "./IssueTransition"
import type { IssueUpdateMetadata } from "./IssueUpdateMetadata"
import type { JsonTypeBean } from "./JsonTypeBean"
import type { Operations } from "./Operations"
import type { PageOfChangelogs } from "./PageOfChangelogs"

/**
 * Details about an issue.
 */
export type IssueBean = {
  /**
   * Expand options that include additional issue details in the response.
   */
  readonly expand?: string
  /**
   * The ID of the issue.
   */
  readonly id?: string
  /**
   * The URL of the issue details.
   */
  readonly self?: string
  /**
   * The key of the issue.
   */
  readonly key?: string
  /**
   * The rendered value of each field present on the issue.
   */
  readonly renderedFields?: Record<string, any>
  /**
   * Details of the issue properties identified in the request.
   */
  readonly properties?: Record<string, any>
  /**
   * The ID and name of each field present on the issue.
   */
  readonly names?: Record<string, string>
  /**
   * The schema describing each field present on the issue.
   */
  readonly schema?: Record<string, JsonTypeBean>
  /**
   * The transitions that can be performed on the issue.
   */
  readonly transitions?: Array<IssueTransition>
  /**
   * The operations that can be performed on the issue.
   */
  readonly operations?: Operations
  /**
   * The metadata for the fields on the issue that can be amended.
   */
  readonly editmeta?: IssueUpdateMetadata
  /**
   * Details of changelogs associated with the issue.
   */
  readonly changelog?: PageOfChangelogs
  /**
   * The versions of each field on the issue.
   */
  readonly versionedRepresentations?: Record<string, Record<string, any>>
  fieldsToInclude?: IncludedFields
  fields?: Record<string, any>
}
