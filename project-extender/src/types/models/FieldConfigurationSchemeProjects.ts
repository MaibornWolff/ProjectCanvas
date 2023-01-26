/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FieldConfigurationScheme } from "./FieldConfigurationScheme"

/**
 * Project list with assigned field configuration schema.
 */
export type FieldConfigurationSchemeProjects = {
  fieldConfigurationScheme?: FieldConfigurationScheme
  /**
   * The IDs of projects using the field configuration scheme.
   */
  projectIds: Array<string>
}
