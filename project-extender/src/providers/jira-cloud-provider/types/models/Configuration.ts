/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TimeTrackingConfiguration } from "./TimeTrackingConfiguration"

/**
 * Details about the configuration of Jira.
 */
export type Configuration = {
  /**
   * Whether the ability for users to vote on issues is enabled. See [Configuring Jira application options](https://confluence.atlassian.com/x/uYXKM) for details.
   */
  readonly votingEnabled?: boolean
  /**
   * Whether the ability for users to watch issues is enabled. See [Configuring Jira application options](https://confluence.atlassian.com/x/uYXKM) for details.
   */
  readonly watchingEnabled?: boolean
  /**
   * Whether the ability to create unassigned issues is enabled. See [Configuring Jira application options](https://confluence.atlassian.com/x/uYXKM) for details.
   */
  readonly unassignedIssuesAllowed?: boolean
  /**
   * Whether the ability to create subtasks for issues is enabled.
   */
  readonly subTasksEnabled?: boolean
  /**
   * Whether the ability to link issues is enabled.
   */
  readonly issueLinkingEnabled?: boolean
  /**
   * Whether the ability to track time is enabled. This property is deprecated.
   */
  readonly timeTrackingEnabled?: boolean
  /**
   * Whether the ability to add attachments to issues is enabled.
   */
  readonly attachmentsEnabled?: boolean
  /**
   * The configuration of time tracking.
   */
  readonly timeTrackingConfiguration?: TimeTrackingConfiguration
}
