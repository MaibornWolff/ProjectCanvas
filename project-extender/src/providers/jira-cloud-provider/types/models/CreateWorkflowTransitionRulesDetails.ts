/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CreateWorkflowCondition } from "./CreateWorkflowCondition"
import type { CreateWorkflowTransitionRule } from "./CreateWorkflowTransitionRule"

/**
 * The details of a workflow transition rules.
 */
export type CreateWorkflowTransitionRulesDetails = {
  /**
   * The workflow conditions.
   */
  conditions?: CreateWorkflowCondition
  /**
   * The workflow validators.
   *
   * **Note:** The default permission validator is always added to the *initial* transition, as in:
   *
   * "validators": [
   * {
   * "type": "PermissionValidator",
   * "configuration": {
   * "permissionKey": "CREATE_ISSUES"
   * }
   * }
   * ]
   */
  validators?: Array<CreateWorkflowTransitionRule>
  /**
   * The workflow post functions.
   *
   * **Note:** The default post functions are always added to the *initial* transition, as in:
   *
   * "postFunctions": [
   * {
   * "type": "IssueCreateFunction"
   * },
   * {
   * "type": "IssueReindexFunction"
   * },
   * {
   * "type": "FireIssueEventFunction",
   * "configuration": {
   * "event": {
   * "id": "1",
   * "name": "issue_created"
   * }
   * }
   * }
   * ]
   *
   * **Note:** The default post functions are always added to the *global* and *directed* transitions, as in:
   *
   * "postFunctions": [
   * {
   * "type": "UpdateIssueStatusFunction"
   * },
   * {
   * "type": "CreateCommentFunction"
   * },
   * {
   * "type": "GenerateChangeHistoryFunction"
   * },
   * {
   * "type": "IssueReindexFunction"
   * },
   * {
   * "type": "FireIssueEventFunction",
   * "configuration": {
   * "event": {
   * "id": "13",
   * "name": "issue_generic"
   * }
   * }
   * }
   * ]
   */
  postFunctions?: Array<CreateWorkflowTransitionRule>
}
