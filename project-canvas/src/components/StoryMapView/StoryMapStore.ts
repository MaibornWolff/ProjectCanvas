/* eslint-disable no-param-reassign */
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import {
  getAllActions,
  getAllSubActionGroups,
  getAllSubActions,
  removeWithId,
} from "./helpers/utils"

import { Action, Case, StoryMap, SubAction, SubActionGroup } from "./Types"

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
  // SubActionGroups
  updateSubActionGroup: (subActionGroup: Partial<SubActionGroup>) => void
  // SubActions
  addSubAction: (subActionGroupId: string, subAction: SubAction) => void
  updateSubAction: (subAction: Partial<SubAction>) => void
  deleteSubAction: (subActionId: string) => void
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
      // SubActions
      addSubAction: (subActionGroupId, subAction) =>
        set((state) => {
          const subActionGroup = getAllSubActionGroups(
            state.storyMaps[0].cases
          ).find((_subActionGroup) => _subActionGroup.id === subActionGroupId)
          if (subActionGroup) subActionGroup.subActions.push(subAction)
        }),
      updateSubAction: ({ id, title }) =>
        set((state) => {
          const subAction = getAllSubActions(state.storyMaps[0].cases).find(
            (_subAction) => _subAction.id === id
          )
          if (subAction && title) subAction.title = title
        }),
      deleteSubAction: (subActionId) =>
        set((state) => {
          const caseSubAction = getAllSubActions(state.storyMaps[0].cases).find(
            (_subAction) => _subAction.id === subActionId
          )

          if (caseSubAction) {
            const subActionGroup = getAllSubActionGroups(
              state.storyMaps[0].cases
            ).find((_actionGroup) =>
              _actionGroup.subActions.includes(caseSubAction)
            )

            if (subActionGroup)
              subActionGroup.subActions = removeWithId<SubAction>(
                subActionGroup.subActions,
                subActionId
              )
          }
        }),
      // SubActionGroup
      updateSubActionGroup: ({ id, subActions, levelId }) =>
        set((state) => {
          const subActionGroup = getAllSubActionGroups(
            state.storyMaps[0].cases
          ).find((_subActionGroup) => _subActionGroup.id === id)
          if (subActionGroup && levelId) subActionGroup.levelId = levelId
          if (subActionGroup && subActions)
            subActionGroup.subActions = subActions
        }),
      // Levels
    })),
    {
      name: "story-map-storage",
    }
  )
)
