/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SecurityLevel } from "./SecurityLevel"

/**
 * Details about a security scheme.
 */
export type SecurityScheme = {
  /**
   * The URL of the issue security scheme.
   */
  readonly self?: string
  /**
   * The ID of the issue security scheme.
   */
  readonly id?: number
  /**
   * The name of the issue security scheme.
   */
  readonly name?: string
  /**
   * The description of the issue security scheme.
   */
  readonly description?: string
  /**
   * The ID of the default security level.
   */
  readonly defaultSecurityLevelId?: number
  levels?: Array<SecurityLevel>
}
