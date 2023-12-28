import { IssueType, Project } from "types"
import { create } from "zustand"

export interface CanvasStore {
  projects: Project[]
  selectedProject: Project | undefined
  selectedProjectBoardIds: number[]
  issueTypes: IssueType[]
  setProjects: (projects: Project[]) => void
  setSelectedProject: (project: Project) => void
  setSelectedProjectBoardIds: (boards: number[]) => void
  setIssueTypes: (types: IssueType[]) => void
}

export const useCanvasStore = create<CanvasStore>()((set) => ({
  projects: [],
  selectedProject: undefined,
  selectedProjectBoardIds: [],
  issueTypes: [],
  setProjects: (projects: Project[]) => set(() => ({ projects })),
  setSelectedProjectBoardIds: (boards: number[]) =>
    set(() => ({ selectedProjectBoardIds: boards })),
  setSelectedProject: (row: Project | undefined) =>
    set(() => ({ selectedProject: row })),
  setIssueTypes: (types: IssueType[]) => set(() => ({ issueTypes: types })),
}))
