/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Metadata for an item in an attachment archive.
 */
export type AttachmentArchiveItemReadable = {
  /**
   * The path of the archive item.
   */
  readonly path?: string
  /**
   * The position of the item within the archive.
   */
  readonly index?: number
  /**
   * The size of the archive item.
   */
  readonly size?: string
  /**
   * The MIME type of the archive item.
   */
  readonly mediaType?: string
  /**
   * The label for the archive item.
   */
  readonly label?: string
}
