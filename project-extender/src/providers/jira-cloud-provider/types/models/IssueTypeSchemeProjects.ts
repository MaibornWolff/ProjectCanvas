/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IssueTypeScheme } from "./IssueTypeScheme"

/**
 * Issue type scheme with a list of the projects that use it.
 */
export type IssueTypeSchemeProjects = {
  /**
   * Details of an issue type scheme.
   */
  issueTypeScheme: IssueTypeScheme
  /**
   * The IDs of the projects using the issue type scheme.
   */
  projectIds: Array<string>
}
