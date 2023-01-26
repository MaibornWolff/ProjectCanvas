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
}

export const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
})

export interface JiraProject {
  projectTypeKey: string
  name: string
  key: string
  lead: {
    displayName: string
  }
}

export interface JiraSprint {
  endDate: string
  startDate: string
  id: number
  state: string
  name: string
}

export interface JiraIssue {
  key: string
  fields: {
    summary: string
    creator: { displayName: string }
    status: { name: string }
    issuetype: { name: string }
    customfield_10107: number
  }
}
