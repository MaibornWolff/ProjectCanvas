/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WebhookDetails } from "./WebhookDetails"

/**
 * Details of webhooks to register.
 */
export type WebhookRegistrationDetails = {
  /**
   * A list of webhooks.
   */
  webhooks: Array<WebhookDetails>
  /**
   * The URL that specifies where to send the webhooks. This URL must use the same base URL as the Connect app. Only a single URL per app is allowed to be registered.
   */
  url: string
}
