import { DocNode } from "@atlaskit/adf-schema";

interface JiraCloudAvatarUrls {
  "16x16": string,
  "24x24": string,
  "32x32": string,
  "48x48": string,
}

export interface JiraCloudUser {
  accountId: string,
  accountType: string,
  active: boolean,
  avatarUrls: JiraCloudAvatarUrls,
  displayName: string,
  emailAddress: string,
  expand: string,
}

export interface JiraCloudProject {
  id: number,
  name: string,
  key: string,
  projectTypeKey: "software" | "service_desk" | "business",
  avatarUrls: JiraCloudAvatarUrls,
  lead: JiraCloudUser,
}

export interface JiraCloudSprint {
  endDate: string,
  startDate: string,
  id: number,
  state: string,
  name: string,
}

export interface JiraCloudChangelogHistoryItem {
  field: string,
  fieldtype: string,
  fieldId: string,
  from: unknown | null,
  fromString: string | null,
  to: unknown | null,
  toString: string | null,
}

export interface JiraCloudChangelogHistory {
  author: JiraCloudUser,
  id: string,
  created: string,
  items: JiraCloudChangelogHistoryItem[],
}

export interface JiraCloudChangelog {
  histories: JiraCloudChangelogHistory[],
}

interface JiraCloudAttachment {
  id: string,
  filename: string,
  created: number,
  mimeType: string,
  size: number,
  /** The URL pointing to the attachment content */
  content: string,
  /** The URL pointing to the attachment thumbnail */
  thumbnail: string,
  author: JiraCloudUser,
}

// EpicIssue structure differs from normal Issue structure
export interface JiraCloudEpic {
  key: string,
  fields: {
    description: string | DocNode,
    summary: string,
    creator: { name: string, displayName: string },
    status: { name: string },
    issuetype: { name: string },
    // TODO: improve this, let's try not to hardcode customfields
    customfield_10107: number,
    parent: { id: string, fields: { summary: string } },
    epic: { name: string },
    labels: string[],
    assignee?: JiraCloudUser,
    [rankCustomField: string]: string | unknown,
    subtasks: {
      id: string,
      key: string,
      fields: {
        summary: string,
      },
    }[],
    project: { id: string },
    created: string,
    updated: string,
    comment: {
      comments: [
        {
          id: string,
          author: JiraCloudUser,
          body: string | DocNode,
          created: string,
          updated: string,
        },
      ],
    },
    sprint?: JiraCloudSprint,
    attachment?: JiraCloudAttachment[],
  },
}

export interface JiraCloudIssue {
  key: string,
  changelog: JiraCloudChangelog,
  fields: {
    description: string | DocNode,
    summary: string,
    creator: { name: string, displayName: string },
    status: { name: string },
    issuetype: { name: string },
    // TODO: improve this, let's try not to:
    //          -hardcode customfields
    //          -not use | unknown if possible.
    //    the problem is: change the LHS name of these props in the fields definition
    //    based on the mapped fields (this.customFields),
    //    it might change based on the jira instance
    customfield_10107: number,
    parent?: JiraCloudIssue,
    epic: { name: string },
    labels: string[],
    assignee: JiraCloudUser,
    [rankCustomField: string]: string | unknown,
    project: JiraCloudProject,
    subtasks: JiraCloudIssue[],
    created: string,
    updated: string,
    comment: {
      comments: [
        {
          id: string,
          author: JiraCloudUser,
          body: string | DocNode,
          created: string,
          updated: string,
        },
      ],
    },
    sprint?: JiraCloudSprint,
    attachment?: JiraCloudAttachment[],
  },
}

interface JiraCloudStatusCategory {
  colorName: string,
  id: number,
  key: string,
  name: string,
}

interface JiraCloudIssueStatus {
  id: string,
  name: string,
  description?: string,
  statusCategory: JiraCloudStatusCategory,
}

export interface JiraCloudIssueTypeWithStatus {
  id: string,
  name: string,
  statuses: JiraCloudIssueStatus[],
  subtask: boolean,
}

export interface JiraCloudPriority {
  id: string,
  name: string,
  statusColor: string,
  description: string,
  iconUrl: string,
  isDefault: boolean,
}
