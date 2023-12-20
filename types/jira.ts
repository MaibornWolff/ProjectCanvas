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

export interface JiraIssue {
  key: string
  fields: {
    description: {
      type: string,
      version: string,
      content: string,
    }
    summary: string
    creator: { name: string; displayName: string }
    status: { name: string }
    issuetype: { name: string }
    // TODO: improve this, let's try not to:
    //          -hardcode customfields
    //          -not use | unknown if possible.
    //    the problem is: change the LHS name of these props in the fields definition
    //    based on the mapped fields (this.customFields),
    //    it might change based on the jira instance
    customfield_10107: number
    parent?: JiraIssue
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
    subtasks: JiraIssue[]
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
