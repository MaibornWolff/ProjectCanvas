/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RoleActor } from "./RoleActor"
import type { Scope } from "./Scope"

/**
 * Details about the roles in a project.
 */
export type ProjectRole = {
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
   * The list of users who act in this role.
   */
  readonly actors?: Array<RoleActor>
  /**
   * The scope of the role. Indicated for roles associated with [next-gen projects](https://confluence.atlassian.com/x/loMyO).
   */
  readonly scope?: Scope
  /**
   * The translated name of the project role.
   */
  translatedName?: string
  /**
   * Whether the calling user is part of this role.
   */
  currentUserRole?: boolean
  /**
   * Whether this role is the admin role for the project.
   */
  readonly admin?: boolean
  /**
   * Whether the roles are configurable for this project.
   */
  readonly roleConfigurable?: boolean
  /**
   * Whether this role is the default role for the project
   */
  readonly default?: boolean
}
