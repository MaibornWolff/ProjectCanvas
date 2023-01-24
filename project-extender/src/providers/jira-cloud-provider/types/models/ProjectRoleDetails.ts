/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Scope } from "./Scope"

/**
 * Details about a project role.
 */
export type ProjectRoleDetails = {
  /**
   * The URL the project role details.
   */
  readonly self?: string
  /**
   * The name of the project role.
   */
  name?: string
  /**
   * The ID of the project role.
   */
  readonly id?: number
  /**
   * The description of the project role.
   */
  readonly description?: string
  /**
   * Whether this role is the admin role for the project.
   */
  readonly admin?: boolean
  /**
   * The scope of the role. Indicated for roles associated with [next-gen projects](https://confluence.atlassian.com/x/loMyO).
   */
  readonly scope?: Scope
  /**
   * Whether the roles are configurable for this project.
   */
  readonly roleConfigurable?: boolean
  /**
   * The translated name of the project role.
   */
  translatedName?: string
  /**
   * Whether this role is the default role for the project.
   */
  readonly default?: boolean
}
