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
    parent: { id: string; fields: { summary: string } }
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
  }
}
