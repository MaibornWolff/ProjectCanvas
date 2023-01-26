/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Details of an issue level security item.
 */
export type SecurityLevel = {
  /**
   * The URL of the issue level security item.
   */
  readonly self?: string
  /**
   * The ID of the issue level security item.
   */
  readonly id?: string
  /**
   * The description of the issue level security item.
   */
  readonly description?: string
  /**
   * The name of the issue level security item.
   */
  readonly name?: string
  /**
   * Whether the issue level security item is the default.
   */
  readonly isDefault?: boolean
  /**
   * The ID of the issue level security scheme.
   */
  readonly issueSecuritySchemeId?: string
}
