/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AttachmentArchiveEntry } from "./AttachmentArchiveEntry"

export type AttachmentArchiveImpl = {
  /**
   * The list of the items included in the archive.
   */
  entries?: Array<AttachmentArchiveEntry>
  /**
   * The number of items in the archive.
   */
  totalEntryCount?: number
}
