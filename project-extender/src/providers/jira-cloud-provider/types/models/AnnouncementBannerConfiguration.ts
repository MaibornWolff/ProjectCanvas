/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Announcement banner configuration.
 */
export type AnnouncementBannerConfiguration = {
  /**
   * The text on the announcement banner.
   */
  readonly message?: string
  /**
   * Flag indicating if the announcement banner can be dismissed by the user.
   */
  readonly isDismissible?: boolean
  /**
   * Flag indicating if the announcement banner is enabled or not.
   */
  readonly isEnabled?: boolean
  /**
   * Hash of the banner data. The client detects updates by comparing hash IDs.
   */
  readonly hashId?: string
  /**
   * Visibility of the announcement banner.
   */
  readonly visibility?: "PUBLIC" | "PRIVATE"
}
