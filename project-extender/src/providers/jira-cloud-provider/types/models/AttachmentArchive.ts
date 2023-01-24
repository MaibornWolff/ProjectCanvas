/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AttachmentArchiveEntry } from "./AttachmentArchiveEntry"

export type AttachmentArchive = {
  moreAvailable?: boolean
  totalEntryCount?: number
  totalNumberOfEntriesAvailable?: number
  entries?: Array<AttachmentArchiveEntry>
}
