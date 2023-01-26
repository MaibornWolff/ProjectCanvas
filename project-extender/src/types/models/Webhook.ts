/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A webhook.
 */
export type Webhook = {
  /**
   * The ID of the webhook.
   */
  id: number
  /**
   * The JQL filter that specifies which issues the webhook is sent for.
   */
  jqlFilter: string
  /**
   * A list of field IDs. When the issue changelog contains any of the fields, the webhook `jira:issue_updated` is sent. If this parameter is not present, the app is notified about all field updates.
   */
  fieldIdsFilter?: Array<string>
  /**
   * A list of issue property keys. A change of those issue properties triggers the `issue_property_set` or `issue_property_deleted` webhooks. If this parameter is not present, the app is notified about all issue property updates.
   */
  issuePropertyKeysFilter?: Array<string>
  /**
   * The Jira events that trigger the webhook.
   */
  events: Array<
    | "jira:issue_created"
    | "jira:issue_updated"
    | "jira:issue_deleted"
    | "comment_created"
    | "comment_updated"
    | "comment_deleted"
    | "issue_property_set"
    | "issue_property_deleted"
  >
  /**
   * The date after which the webhook is no longer sent. Use [Extend webhook life](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-webhooks/#api-rest-api-3-webhook-refresh-put) to extend the date.
   */
  readonly expirationDate?: number
}
