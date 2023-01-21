import { Project } from "project-extender"
import { create } from "zustand"

export interface CanvasStore {
  selectedProject: Project | undefined
  selectedProjectBoardIds: number[]
  setSelectedProject: (project: Project) => void
  setselectedProjectBoardIds: (boards: number[]) => void
}

export const useCanvasStore = create<CanvasStore>()((set) => ({
  selectedProject: undefined,
  selectedProjectBoardIds: [],
  setselectedProjectBoardIds: (boards: number[]) =>
    set(() => ({ selectedProjectBoardIds: boards })),
  setSelectedProject: (row: Project | undefined) =>
    set(() => ({ selectedProject: row })),
}))
