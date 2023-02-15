export interface Sprint {
  id: number
  name: string
  state: string
  startDate: Intl.DateTimeFormat
  endDate: Intl.DateTimeFormat
}

export interface Project {
  id?: string
  key: string
  name: string
  lead: string
  type: string
}

export interface Priority {
  statusColor: string
  description: string
  iconUrl: string
  name: string
  id: string
  isDefault: boolean
}

export interface Issue {
  issueKey: string
  summary: string
  creator: string
  status: string
  type: string
  description: string
  storyPointsEstimate: number
  epic: string
  labels: string[]
  assignee: {
    id: string
    displayName: string
    avatarUrls: {
      "48x48": string
      "24x24": string
      "16x16": string
      "32x32": string
    }
  }
  rank: string
  reporter: string
  attachement: string
  sprintId: string
  projectId: string
  subtasks: {
    id: string
    key: string
    fields: {
      summary: string
    }
  }[]
  created: string
  updated: string
  comment: {
    comments: [
      {
        id: string
        author: {
          accountId: string
          avatarUrls: {
            "48x48": string
            "24x24": string
            "16x16": string
            "32x32": string
          }
          displayName: string
        }
        body: string
        created: string
        updated: string
      }
    ]
  }
  startDate: Date
  dueDate: Date
  priority: Priority
}

interface IssueStatus {
  description?: string
  id: string
  name: string
}

export interface IssueType {
  id: string
  name?: string
  statuses?: IssueStatus[]
  subtask: boolean
}

export interface User {
  accountId: string
  emailAddress: string
  avatarUrls: {
    "48x48": string
    "24x24": string
    "16x16": string
    "32x32": string
  }
  displayName: string
}

export const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
})
