/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AvatarUrlsBean } from "./AvatarUrlsBean"
import type { IssueTypeIssueCreateMetadata } from "./IssueTypeIssueCreateMetadata"

/**
 * Details of the issue creation metadata for a project.
 */
export type ProjectIssueCreateMetadata = {
  /**
   * Expand options that include additional project issue create metadata details in the response.
   */
  readonly expand?: string
  /**
   * The URL of the project.
   */
  readonly self?: string
  /**
   * The ID of the project.
   */
  readonly id?: string
  /**
   * The key of the project.
   */
  readonly key?: string
  /**
   * The name of the project.
   */
  readonly name?: string
  /**
   * List of the project's avatars, returning the avatar size and associated URL.
   */
  readonly avatarUrls?: AvatarUrlsBean
  /**
   * List of the issue types supported by the project.
   */
  readonly issuetypes?: Array<IssueTypeIssueCreateMetadata>
}
