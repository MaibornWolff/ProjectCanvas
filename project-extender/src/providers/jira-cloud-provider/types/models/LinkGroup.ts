/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SimpleLink } from "./SimpleLink"

/**
 * Details a link group, which defines issue operations.
 */
export type LinkGroup = {
  id?: string
  styleClass?: string
  header?: SimpleLink
  weight?: number
  links?: Array<SimpleLink>
  groups?: Array<LinkGroup>
}
