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
  type: string
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
  storyPoints: number
}
