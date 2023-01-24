/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * List of custom fields using the version.
 */
export type VersionUsageInCustomField = {
  /**
   * The name of the custom field.
   */
  readonly fieldName?: string
  /**
   * The ID of the custom field.
   */
  readonly customFieldId?: number
  /**
   * Count of the issues where the custom field contains the version.
   */
  readonly issueCountWithVersionInCustomField?: number
}
