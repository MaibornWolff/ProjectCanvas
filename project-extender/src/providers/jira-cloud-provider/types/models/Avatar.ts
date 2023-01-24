/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Details of an avatar.
 */
export type Avatar = {
  /**
   * The ID of the avatar.
   */
  id: string
  /**
   * The owner of the avatar. For a system avatar the owner is null (and nothing is returned). For non-system avatars this is the appropriate identifier, such as the ID for a project or the account ID for a user.
   */
  readonly owner?: string
  /**
   * Whether the avatar is a system avatar.
   */
  readonly isSystemAvatar?: boolean
  /**
   * Whether the avatar is used in Jira. For example, shown as a project's avatar.
   */
  readonly isSelected?: boolean
  /**
   * Whether the avatar can be deleted.
   */
  readonly isDeletable?: boolean
  /**
   * The file name of the avatar icon. Returned for system avatars.
   */
  readonly fileName?: string
  /**
   * The list of avatar icon URLs.
   */
  readonly urls?: Record<string, string>
}
