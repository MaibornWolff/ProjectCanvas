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
  state: string
  startDate: Intl.DateTimeFormat
  endDate: Intl.DateTimeFormat
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
  storyPointsEstimate: number
}

export const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
})
