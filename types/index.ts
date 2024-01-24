export interface Sprint {
  id: number,
  name: string,
  state: string,
  startDate: Intl.DateTimeFormat,
  endDate: Intl.DateTimeFormat,
}

export interface Project {
  id?: string,
  key: string,
  name: string,
  lead: string,
  type: string,
}

export interface User {
  id: string,
  name: string,
  displayName: string,
  emailAddress: string,
  avatarUrls: {
    "16x16": string,
    "24x24": string,
    "32x32": string,
    "48x48": string,
  },
}

export interface Priority {
  statusColor: string,
  description: string,
  iconUrl: string,
  name: string,
  id: string,
  isDefault: boolean,
}

export interface Attachment {
  id: string,
  filename: string,
  created: string,
  mimeType: string,
  content: string,
}

export interface ChangelogHistoryItem {
  field: string,
  fieldtype: string,
  fieldId: string,
  from: unknown | null,
  fromString: string | null,
  to: unknown | null,
  toString: string | null,
}

export interface ChangelogHistory {
  author: User,
  id: string,
  created: string,
  items: ChangelogHistoryItem[],
}

export interface Changelog {
  histories: ChangelogHistory[],
}

export interface Issue {
  issueKey: string,
  summary: string,
  creator: string,
  status: string,
  type: string,
  description: string,
  storyPointsEstimate: number,
  epic: {
    issueKey?: string,
    summary?: string,
  },
  labels: string[],
  assignee?: User,
  rank: string,
  reporter: User,
  sprint?: Sprint,
  projectId: string,
  subtasks: {
    id: string,
    key: string,
    fields: {
      summary: string,
    },
  }[],
  created: string,
  updated: string,
  comment: {
    comments: [
      {
        id: string,
        author: User,
        body: string,
        created: string,
        updated: string,
      },
    ],
  },
  startDate: Date,
  dueDate: Date,
  priority: Priority,
  attachments: Attachment[],
  changelog: Changelog,
}

export interface IssueStatus {
  description?: string,
  id: string,
  name: string,
  statusCategory: {
    id: number,
    key: string,
    name: string,
  },
}

export interface IssueType {
  id: string,
  name?: string,
  statuses?: IssueStatus[],
  subtask: boolean,
}

export interface SprintCreate {
  name: string,
  startDate: Date,
  endDate: Date,
  originBoardId: number,
  goal: string,
}

export const dateTimeFormat = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export interface Resource {
  baseUrl: string,
  authorization: string,
}
