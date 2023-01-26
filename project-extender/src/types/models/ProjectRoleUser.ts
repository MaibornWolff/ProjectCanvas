/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Details of the user associated with the role.
 */
export type ProjectRoleUser = {
  /**
   * The account ID of the user, which uniquely identifies the user across all Atlassian products. For example, *5b10ac8d82e05b22cc7d4ef5*. Returns *unknown* if the record is deleted and corrupted, for example, as the result of a server import.
   */
  readonly accountId?: string
}
