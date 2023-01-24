/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A project's sender email address.
 */
export type ProjectEmailAddress = {
  /**
   * The email address.
   */
  emailAddress?: string
  /**
   * When using a custom domain, the status of the email address.
   */
  emailAddressStatus?: Array<string>
}
