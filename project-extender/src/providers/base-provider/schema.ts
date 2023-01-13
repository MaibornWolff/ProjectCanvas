export interface FetchedProject {
  projectTypeKey: string
  name: string
  key: string
  lead: {
    displayName: string
  }
}

export interface ProjectData {
  name: string
  key: string
  type: string
  lead: string
}
