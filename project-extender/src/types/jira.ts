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
    // TODO: improve this, let's try not to:
    //          -hardcode customfields
    //          -not use | unknown if possible.
    //    the problem is: change the LHS name of these props in the fields definition
    //    based on the mapped fields (this.customFields),
    //    it might change based on the jira instance
    customfield_10107: number
    [rankCustomField: string]: string | unknown
  }
}
