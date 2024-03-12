import { Attachment, Priority, User } from ".";

export interface JiraProject {
  projectTypeKey: string,
  id: number,
  name: string,
  key: string,
  lead: {
    displayName: string,
  },
}

export interface JiraSprint {
  endDate: string,
  startDate: string,
  id: number,
  state: string,
  name: string,
}

export interface JiraChangelogHistoryItem {
  field: string,
  fieldtype: string,
  fieldId: string,
  from: unknown | null,
  fromString: string | null,
  to: unknown | null,
  toString: string | null,
}

export interface JiraChangelogHistory {
  author: User,
  id: string,
  created: string,
  items: JiraChangelogHistoryItem[],
}

export interface JiraChangelog {
  histories: JiraChangelogHistory[],
}

// EpicIssue structure differs from normal Issue structure
export interface JiraEpic {
  key: string,
  fields: {
    description: string,
    summary: string,
    creator: { name: string, displayName: string },
    status: { name: string },
    issuetype: { name: string },
    // TODO: improve this, let's try not to hardcode customfields
    customfield_10107: number,
    parent: { id: string, fields: { summary: string } },
    epic: { name: string },
    labels: string[],
    assignee: {
      displayName: string,
      avatarUrls: {
        "16x16": string,
        "24x24": string,
        "36x36": string,
        "48x48": string,
      },
    },
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
          author: {
            accountId: string,
            avatarUrls: {
              "48x48": string,
              "24x24": string,
              "16x16": string,
              "32x32": string,
            },
            displayName: string,
          },
          body: {
            type: string,
            version: number,
            content: string,
          },
          created: string,
          updated: string,
        },
      ],
    },
    sprint?: JiraSprint,
    attachment?: Attachment[],
  },
}

export interface JiraIssue {
  key: string,
  changelog: JiraChangelog,
  fields: {
    description: string,
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
    parent?: JiraIssue,
    epic: { name: string },
    labels: string[],
    assignee: {
      displayName: string,
      avatarUrls: {
        "16x16": string,
        "24x24": string,
        "36x36": string,
        "48x48": string,
      },
    },
    [rankCustomField: string]: string | unknown,
    subtasks: JiraIssue[],
    project: { id: string },
    created: string,
    updated: string,
    comment: {
      comments: [
        {
          id: string,
          author: {
            accountId: string,
            avatarUrls: {
              "48x48": string,
              "24x24": string,
              "16x16": string,
              "32x32": string,
            },
            displayName: string,
          },
          body: string,
          created: string,
          updated: string,
        },
      ],
    },
    sprint?: JiraSprint,
    attachment?: Attachment[],
  },
}

interface JiraIssueStatus {
  description?: string,
  id: string,
  name: string,
}

export interface JiraIssueType {
  id: string,
  name?: string,
  statuses?: JiraIssueStatus[],
  subtask: boolean,
}

export interface JiraPriority {
  values: Priority[],
}
