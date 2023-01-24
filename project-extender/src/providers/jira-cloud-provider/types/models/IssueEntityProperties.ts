/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonNode } from "./JsonNode"

/**
 * Lists of issues and entity properties. See [Entity properties](https://developer.atlassian.com/cloud/jira/platform/jira-entity-properties/) for more information.
 */
export type IssueEntityProperties = {
  /**
   * A list of entity property IDs.
   */
  entitiesIds?: Array<number>
  /**
   * A list of entity property keys and values.
   */
  properties?: Record<string, JsonNode>
}
