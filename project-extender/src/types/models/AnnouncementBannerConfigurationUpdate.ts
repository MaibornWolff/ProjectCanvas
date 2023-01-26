/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Configuration of the announcement banner.
 */
export type AnnouncementBannerConfigurationUpdate = {
  /**
   * The text on the announcement banner.
   */
  message?: string
  /**
   * Flag indicating if the announcement banner can be dismissed by the user.
   */
  isDismissible?: boolean
  /**
   * Flag indicating if the announcement banner is enabled or not.
   */
  isEnabled?: boolean
  /**
   * Visibility of the announcement banner. Can be public or private.
   */
  visibility?: string
}
