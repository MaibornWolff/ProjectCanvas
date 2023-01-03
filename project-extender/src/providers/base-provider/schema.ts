export interface User {
  self: string
  name: string
  emailAddress: string
  // TODO: add more fields
}
export interface Project {
  projectTypeKey: string
  name: string
  key: string
  lead: {
    displayName: string
  }
}
