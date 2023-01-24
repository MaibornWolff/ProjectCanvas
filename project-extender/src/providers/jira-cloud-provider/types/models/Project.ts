/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AvatarUrlsBean } from "./AvatarUrlsBean"
import type { Hierarchy } from "./Hierarchy"
import type { IssueTypeDetails } from "./IssueTypeDetails"
import type { ProjectCategory } from "./ProjectCategory"
import type { ProjectComponent } from "./ProjectComponent"
import type { ProjectInsight } from "./ProjectInsight"
import type { ProjectLandingPageInfo } from "./ProjectLandingPageInfo"
import type { ProjectPermissions } from "./ProjectPermissions"
import type { User } from "./User"
import type { Version } from "./Version"

/**
 * Details about a project.
 */
export type Project = {
  /**
   * Expand options that include additional project details in the response.
   */
  readonly expand?: string
  /**
   * The URL of the project details.
   */
  readonly self?: string
  /**
   * The ID of the project.
   */
  id?: string
  /**
   * The key of the project.
   */
  readonly key?: string
  /**
   * A brief description of the project.
   */
  readonly description?: string
  /**
   * The username of the project lead.
   */
  readonly lead?: User
  /**
   * List of the components contained in the project.
   */
  readonly components?: Array<ProjectComponent>
  /**
   * List of the issue types available in the project.
   */
  readonly issueTypes?: Array<IssueTypeDetails>
  /**
   * A link to information about this project, such as project documentation.
   */
  readonly url?: string
  /**
   * An email address associated with the project.
   */
  email?: string
  /**
   * The default assignee when creating issues for this project.
   */
  readonly assigneeType?: "PROJECT_LEAD" | "UNASSIGNED"
  /**
   * The versions defined in the project. For more information, see [Create version](#api-rest-api-3-version-post).
   */
  readonly versions?: Array<Version>
  /**
   * The name of the project.
   */
  readonly name?: string
  /**
   * The name and self URL for each role defined in the project. For more information, see [Create project role](#api-rest-api-3-role-post).
   */
  readonly roles?: Record<string, string>
  /**
   * The URLs of the project's avatars.
   */
  readonly avatarUrls?: AvatarUrlsBean
  /**
   * The category the project belongs to.
   */
  readonly projectCategory?: ProjectCategory
  /**
   * The [project type](https://confluence.atlassian.com/x/GwiiLQ#Jiraapplicationsoverview-Productfeaturesandprojecttypes) of the project.
   */
  readonly projectTypeKey?: "software" | "service_desk" | "business"
  /**
   * Whether the project is simplified.
   */
  readonly simplified?: boolean
  /**
   * The type of the project.
   */
  readonly style?: "classic" | "next-gen"
  /**
   * Whether the project is selected as a favorite.
   */
  favourite?: boolean
  /**
   * Whether the project is private.
   */
  readonly isPrivate?: boolean
  /**
   * The issue type hierarchy for the project.
   */
  readonly issueTypeHierarchy?: Hierarchy
  /**
   * User permissions on the project
   */
  readonly permissions?: ProjectPermissions
  /**
   * Map of project properties
   */
  readonly properties?: Record<string, any>
  /**
   * Unique ID for next-gen projects.
   */
  readonly uuid?: string
  /**
   * Insights about the project.
   */
  readonly insight?: ProjectInsight
  /**
   * Whether the project is marked as deleted.
   */
  readonly deleted?: boolean
  /**
   * The date when the project is deleted permanently.
   */
  readonly retentionTillDate?: string
  /**
   * The date when the project was marked as deleted.
   */
  readonly deletedDate?: string
  /**
   * The user who marked the project as deleted.
   */
  readonly deletedBy?: User
  /**
   * Whether the project is archived.
   */
  readonly archived?: boolean
  /**
   * The date when the project was archived.
   */
  readonly archivedDate?: string
  /**
   * The user who archived the project.
   */
  readonly archivedBy?: User
  /**
   * The project landing page info.
   */
  readonly landingPageInfo?: ProjectLandingPageInfo
}
