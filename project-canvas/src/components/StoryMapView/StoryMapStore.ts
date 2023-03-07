/* eslint-disable no-param-reassign */
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import { removeWithId, getAllActions } from "./helpers/utils"

import { Action, Case, StoryMap } from "./Types"

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
  // Actions
  addAction: (caseId: string, action: Action) => void
  updateAction: (action: Partial<Action>) => void
  deleteAction: (actionId: string) => void
  // // SubActionGroups
  // addSubActionGroup: (subActionGroup: SubActionGroup) => void
  // updateSubActionGroup: (subActionGroup: Partial<SubActionGroup>) => void
  // deleteSubActionGroup: (subActionGroupId: string) => void
  // // SubActions
  // addSubAction: (subAction: SubAction) => void
  // updateSubAction: (subAction: Partial<SubAction>) => void
  // deleteSubAction: (subActionId: string) => void
  // // Levels
  // addLevel: (level: SubAction) => void
  // updateLevel: (level: Partial<SubActionLevel>) => void
  // deleteLevel: (levelId: string) => void
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
      // Cases
      addCase: (caseColumn) =>
        set((state) => {
          state.storyMaps[0].cases.push(caseColumn)
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
      deleteCase: (caseId) =>
        set((state) => {
          state.storyMaps[0].cases = removeWithId(
            state.storyMaps[0].cases,
            caseId
          )
        }),
      // Actions
      addAction: (caseId, action) =>
        set((state) => {
          state.storyMaps[0].cases
            .find((c) => c.id === caseId)
            ?.actions.push(action)
        }),
      updateAction: ({ id, title, subActionGroups }) =>
        set((state) => {
          const caseAction = getAllActions(state.storyMaps[0].cases).find(
            (_action) => _action.id === id
          )
          if (caseAction && title) caseAction.title = title
          if (caseAction && subActionGroups)
            caseAction.subActionGroups = subActionGroups
        }),
      deleteAction: (actionId) =>
        set((state) => {
          const caseAction = getAllActions(state.storyMaps[0].cases).find(
            (_action) => _action.id === actionId
          )

          if (caseAction) {
            const caseOfAction = state.storyMaps[0].cases.find((_case) =>
              _case.actions.includes(caseAction)
            )
            if (caseOfAction)
              caseOfAction.actions = removeWithId<Action>(
                caseOfAction.actions,
                caseAction.id
              )
          }
        }),
      // SubActionGroups
      // SubActions
      // Levels
    })),
    {
      name: "story-map-storage",
    }
  )
)
