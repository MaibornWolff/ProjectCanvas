/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityProperty } from "./EntityProperty"
import type { UserDetails } from "./UserDetails"
import type { Visibility } from "./Visibility"

/**
 * A comment.
 */
export type Comment = {
  /**
   * The URL of the comment.
   */
  readonly self?: string
  /**
   * The ID of the comment.
   */
  readonly id?: string
  /**
   * The ID of the user who created the comment.
   */
  readonly author?: UserDetails
  /**
   * The comment text in [Atlassian Document Format](https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/).
   */
  body?: any
  /**
   * The rendered version of the comment.
   */
  readonly renderedBody?: string
  /**
   * The ID of the user who updated the comment last.
   */
  readonly updateAuthor?: UserDetails
  /**
   * The date and time at which the comment was created.
   */
  readonly created?: string
  /**
   * The date and time at which the comment was updated last.
   */
  readonly updated?: string
  /**
   * The group or role to which this comment is visible. Optional on create and update.
   */
  visibility?: Visibility
  /**
   * Whether the comment is visible in Jira Service Desk. Defaults to true when comments are created in the Jira Cloud Platform. This includes when the site doesn't use Jira Service Desk or the project isn't a Jira Service Desk project and, therefore, there is no Jira Service Desk for the issue to be visible on. To create a comment with its visibility in Jira Service Desk set to false, use the Jira Service Desk REST API [Create request comment](https://developer.atlassian.com/cloud/jira/service-desk/rest/#api-rest-servicedeskapi-request-issueIdOrKey-comment-post) operation.
   */
  readonly jsdPublic?: boolean
  /**
   * Whether the comment was added from an email sent by a person who is not part of the issue. See [Allow external emails to be added as comments on issues](https://support.atlassian.com/jira-service-management-cloud/docs/allow-external-emails-to-be-added-as-comments-on-issues/)for information on setting up this feature.
   */
  readonly jsdAuthorCanSeeRequest?: boolean
  /**
   * A list of comment properties. Optional on create and update.
   */
  properties?: Array<EntityProperty>
}
