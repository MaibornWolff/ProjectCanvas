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
  }
}
