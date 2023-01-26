/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * An entity property, for more information see [Entity properties](https://developer.atlassian.com/cloud/jira/platform/jira-entity-properties/).
 */
export type EntityProperty = {
  /**
   * The key of the property. Required on create and update.
   */
  key?: string
  /**
   * The value of the property. Required on create and update.
   */
  value?: any
}
