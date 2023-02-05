import { IssueType, Project } from "project-extender"
import { create } from "zustand"

export interface CanvasStore {
  stateProjects: Project[]
  selectedProject: Project | undefined
  selectedProjectBoardIds: number[]
  issueTypes: IssueType[]
  setStateProjects: (projects: Project[]) => void
  setSelectedProject: (project: Project) => void
  setselectedProjectBoardIds: (boards: number[]) => void
  setIssueTypes: (types: IssueType[]) => void
}

export const useCanvasStore = create<CanvasStore>()((set) => ({
  stateProjects: [],
  selectedProject: undefined,
  selectedProjectBoardIds: [],
  issueTypes: [],
  setStateProjects: (projects: Project[]) =>
    set(() => ({ stateProjects: projects })),
  setselectedProjectBoardIds: (boards: number[]) =>
    set(() => ({ selectedProjectBoardIds: boards })),
  setSelectedProject: (row: Project | undefined) =>
    set(() => ({ selectedProject: row })),
  setIssueTypes: (types: IssueType[]) => set(() => ({ issueTypes: types })),
}))
