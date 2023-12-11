import { Attachment, Priority } from "."

export interface JiraProject {
  projectTypeKey: string
  id: number
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
// EpicIssue structure differs from normal Issue structure
export interface JiraEpic {
  key: string
  fields: {
    description: string
    summary: string
    creator: { name: string; displayName: string }
    status: { name: string }
    issuetype: { name: string }
    customfield_10107: number
    parent: { id: string; fields: { summary: string } }
    epic: { name: string }
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
    [rankCustomField: string]: string | unknown
    subtasks: {
      id: string
      key: string
      fields: {
        summary: string
      }
    }[]
    project: { id: string }
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
          body: {
            type: string
            version: number
            content: [
              {
                type: string
                content: [
                  {
                    type: string
                    text: string
                  }
                ]
              }
            ]
          }
          created: string
          updated: string
        }
      ]
    }
    sprint?: JiraSprint
    attachment?: Attachment[]
  }
}
export interface JiraIssue {
  key: string
  fields: {
    description: string
    summary: string
    creator: { name: string; displayName: string }
    status: { name: string }
    issuetype: { name: string }
    customfield_10107: number
    parent: { id: string; fields: { summary: string } }
    epic: { name: string }
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
    [rankCustomField: string]: string | unknown
    subtasks: {
      id: string
      key: string
      fields: {
        summary: string
      }
    }[]
    project: { id: string }
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
    sprint?: JiraSprint
    attachment?: Attachment[]
  }
}

interface JiraIssueStatus {
  description?: string
  id: string
  name: string
}

export interface JiraIssueType {
  id: string
  name?: string
  statuses?: JiraIssueStatus[]
  subtask: boolean
}

export interface JiraPriority {
  values: Priority[]
}
