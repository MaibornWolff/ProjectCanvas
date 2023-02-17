export interface SubAction {
  id: string
  title: string
}

export interface SubActionGroup {
  id: string
  levelId: string
  subActions: SubAction[]
}
export interface Action {
  id: string
  title: string
  subActionGroups: SubActionGroup[]
}
export interface Case {
  id: string
  title: string
  actions: Action[]
}

export interface SubActionLevel {
  id: string
  title: string
}
