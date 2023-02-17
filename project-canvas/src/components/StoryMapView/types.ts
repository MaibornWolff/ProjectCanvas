export interface SubAction {
  id: string
  title: string
}

export interface Action {
  id: string
  title: string
  subActions: SubAction[]
}
export interface Case {
  id: string
  title: string
  actions: Action[]
}
