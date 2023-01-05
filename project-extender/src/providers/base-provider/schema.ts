export interface DndListProps {
  data: {
    position: number
    mass: number
    symbol: string
    name: string
  }[]
}

export interface IssueData {
  data: {
    key: string
    summary: string
    creator: string
    status: string
  }[]
}
export interface Project {
  projectTypeKey: string
  name: string
  key: string
  lead: {
    displayName: string
  }
}
