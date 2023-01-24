/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserDetails } from "./UserDetails"

/**
 * Details about an attachment.
 */
export type Attachment = {
  /**
   * The URL of the attachment details response.
   */
  readonly self?: string
  /**
   * The ID of the attachment.
   */
  readonly id?: string
  /**
   * The file name of the attachment.
   */
  readonly filename?: string
  /**
   * Details of the user who added the attachment.
   */
  readonly author?: UserDetails
  /**
   * The datetime the attachment was created.
   */
  readonly created?: string
  /**
   * The size of the attachment.
   */
  readonly size?: number
  /**
   * The MIME type of the attachment.
   */
  readonly mimeType?: string
  /**
   * The content of the attachment.
   */
  readonly content?: string
  /**
   * The URL of a thumbnail representing the attachment.
   */
  readonly thumbnail?: string
}
