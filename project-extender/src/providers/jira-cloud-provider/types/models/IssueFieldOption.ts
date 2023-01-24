/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IssueFieldOptionConfiguration } from "./IssueFieldOptionConfiguration"

/**
 * Details of the options for a select list issue field.
 */
export type IssueFieldOption = {
  /**
   * The unique identifier for the option. This is only unique within the select field's set of options.
   */
  id: number
  /**
   * The option's name, which is displayed in Jira.
   */
  value: string
  /**
   * The properties of the object, as arbitrary key-value pairs. These properties can be searched using JQL, if the extractions (see [Issue Field Option Property Index](https://developer.atlassian.com/cloud/jira/platform/modules/issue-field-option-property-index/)) are defined in the descriptor for the issue field module.
   */
  properties?: Record<string, any>
  config?: IssueFieldOptionConfiguration
}
