export interface DndListProps {
  data: {
    position: number
    mass: number
    symbol: string
    name: string
  }[]
}

export interface Issue {
  key: string
  summary: string
  creator: string
  status: string
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
