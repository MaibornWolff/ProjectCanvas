export interface DndListProps {
  data: {
    position: number
    mass: number
    symbol: string
    name: string
  }[]
}

export interface Sprint {
  id: number
  name: string
  state: string
  startDate: Intl.DateTimeFormat
  endDate: Intl.DateTimeFormat
}

export interface Project {
  name: string
  key: string
  id?: string
  lead: string
  type: string
}

export interface Issue {
  issueKey: string
  summary: string
  creator: string
  status: string
  index: number
  columnId: string
  type: string
  storyPointsEstimate: number
  epic: string
  labels: string[]
  assignee: {
    displayName: string
    avatarUrls: {
      "16x16": string
      "24x24": string
      "36x36": string
      "48x48": string
    }
  }
  rank: string
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
  avatarUrls: { [key: string]: string }
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
