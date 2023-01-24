/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { User } from "./User"

/**
 * Metadata for an issue attachment.
 */
export type AttachmentMetadata = {
  /**
   * The ID of the attachment.
   */
  readonly id?: number
  /**
   * The URL of the attachment metadata details.
   */
  readonly self?: string
  /**
   * The name of the attachment file.
   */
  readonly filename?: string
  /**
   * Details of the user who attached the file.
   */
  readonly author?: User
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
   * Additional properties of the attachment.
   */
  readonly properties?: Record<string, any>
  /**
   * The URL of the attachment.
   */
  readonly content?: string
  /**
   * The URL of a thumbnail representing the attachment.
   */
  readonly thumbnail?: string
}
