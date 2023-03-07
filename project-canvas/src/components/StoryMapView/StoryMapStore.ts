/* eslint-disable no-param-reassign */
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import { removeWithId } from "./helpers/utils"

import { Case, StoryMap } from "./Types"

export interface StoryMapStore {
  storyMaps: StoryMap[]
  // StoryMaps
  addStoryMap: (storyMap: StoryMap) => void
  deleteStoryMap: (storyMapId: string) => void
  deleteAllStoryMaps: () => void
  // Cases
  addCase: (caseColumn: Case) => void
  updateCase: (caseColumn: Partial<Case>) => void
  deleteCase: (caseId: string) => void
  // // Actions
  // addAction: (action: Action) => void
  // updateAction: (action: Partial<Action>) => void
  // deleteAction: (caseId: string) => void
  // // ActionGroups
  // addSubActionGroup: (action: Action) => void
  // updateSubActionGroup: (action: Partial<Action>) => void
  // deleteSubActionGroup: (caseId: string) => void
  // // SubActions
  // addSubAction: (action: Action) => void
  // updateSubAction: (action: Partial<Action>) => void
  // deleteSubAction: (caseId: string) => void
}

export const useStoryMapStore = create<StoryMapStore>()(
  persist(
    immer((set, get) => ({
      storyMaps: [],
      addStoryMap: (storyMap: StoryMap) =>
        set((state) => {
          state.storyMaps.push(storyMap)
        }),
      deleteStoryMap: (storyMapId: string) => {
        set((state) => {
          state.storyMaps = removeWithId(state.storyMaps || [], storyMapId)
        })
      },
      deleteAllStoryMaps: () => set({ storyMaps: [] }),
      // Case
      addCase: (caseColumn) =>
        set((state) => {
          state.storyMaps[0].cases.push(caseColumn)
        }),
      deleteCase: (caseId) =>
        set((state) => {
          state.storyMaps[0].cases = removeWithId(
            state.storyMaps[0].cases,
            caseId
          )
        }),
      updateCase: ({ id, title, actions }) =>
        set(() => {
          const caseColumn = get().storyMaps[0].cases.find((c) => c.id === id)
          if (caseColumn) {
            if (id) caseColumn.id = id
            if (title) caseColumn.title = title
            if (actions) caseColumn.actions = actions
          }
        }),
      // Action
    })),
    {
      name: "story-map-storage",
    }
  )
)
