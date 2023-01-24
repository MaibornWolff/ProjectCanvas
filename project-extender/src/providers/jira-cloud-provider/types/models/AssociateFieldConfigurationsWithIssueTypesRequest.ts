/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FieldConfigurationToIssueTypeMapping } from "./FieldConfigurationToIssueTypeMapping"

/**
 * Details of a field configuration to issue type mappings.
 */
export type AssociateFieldConfigurationsWithIssueTypesRequest = {
  /**
   * Field configuration to issue type mappings.
   */
  mappings: Array<FieldConfigurationToIssueTypeMapping>
}
