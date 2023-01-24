/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Details of the instance's attachment settings.
 */
export type AttachmentSettings = {
  /**
   * Whether the ability to add attachments is enabled.
   */
  readonly enabled?: boolean
  /**
   * The maximum size of attachments permitted, in bytes.
   */
  readonly uploadLimit?: number
}
