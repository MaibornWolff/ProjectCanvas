/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AttachmentArchiveItemReadable } from "./AttachmentArchiveItemReadable"

/**
 * Metadata for an archive (for example a zip) and its contents.
 */
export type AttachmentArchiveMetadataReadable = {
  /**
   * The ID of the attachment.
   */
  readonly id?: number
  /**
   * The name of the archive file.
   */
  readonly name?: string
  /**
   * The list of the items included in the archive.
   */
  readonly entries?: Array<AttachmentArchiveItemReadable>
  /**
   * The number of items included in the archive.
   */
  readonly totalEntryCount?: number
  /**
   * The MIME type of the attachment.
   */
  readonly mediaType?: string
}
