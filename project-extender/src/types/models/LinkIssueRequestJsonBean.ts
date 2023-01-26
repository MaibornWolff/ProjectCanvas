/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Comment } from "./Comment"
import type { IssueLinkType } from "./IssueLinkType"
import type { LinkedIssue } from "./LinkedIssue"

export type LinkIssueRequestJsonBean = {
  type: IssueLinkType
  inwardIssue: LinkedIssue
  outwardIssue: LinkedIssue
  comment?: Comment
}
