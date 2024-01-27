/* eslint-disable no-param-reassign */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  getAllActions,
  getAllSubActionGroups,
  getAllSubActions,
  getRndInteger,
  removeWithId,
  SUB_ACTION_GROUP_PREFIX,
} from "./helpers/utils";

import { Action, Case, StoryMap, SubAction, SubActionGroup, SubActionLevel } from "./Types";

export interface StoryMapStore {
  storyMaps: StoryMap[],
  // StoryMaps
  addStoryMap: (storyMap: StoryMap) => void,
  updateStoryMap: (storyMap: Partial<StoryMap>) => void,
  deleteStoryMap: (storyMapId: string) => void,
  deleteAllStoryMaps: () => void,
  // Cases
  addCase: (storyMapId: string, caseColumn: Case) => void,
  updateCase: (storyMapId: string, caseColumn: Partial<Case>) => void,
  deleteCase: (storyMapId: string, caseId: string) => void,
  // Actions
  addAction: (storyMapId: string, caseId: string, action: Action) => void,
  updateAction: (storyMapId: string, action: Partial<Action>) => void,
  deleteAction: (storyMapId: string, actionId: string) => void,
  // SubActionGroups
  addSubActionGroups: (storyMapId: string, levelId: string) => void,
  updateSubActionGroup: (
    storyMapId: string,
    subActionGroup: Partial<SubActionGroup>
  ) => void,
  // SubActions
  addSubAction: (
    storyMapId: string,
    subActionGroupId: string,
    subAction: SubAction
  ) => void,
  updateSubAction: (storyMapId: string, subAction: Partial<SubAction>) => void,
  deleteSubAction: (storyMapId: string, subActionId: string) => void,
  // Levels
  addLevel: (storyMapId: string, level: SubAction) => void,
  updateLevel: (storyMapId: string, level: Partial<SubActionLevel>) => void,
  deleteLevel: (storyMapId: string, levelId: string) => void,
}

export const useStoryMapStore = create<StoryMapStore>()(
  persist(
    immer((set) => ({
      storyMaps: [],
      addStoryMap: (storyMap) => set((state) => {
        state.storyMaps.push(storyMap);
      }),
      updateStoryMap: ({ id, name }) => set((state) => {
        const storyMap = state.storyMaps.find(
          (_storyMap) => _storyMap.id === id,
        );
        if (storyMap && name) storyMap.name = name;
      }),
      deleteStoryMap: (storyMapId) => {
        set((state) => {
          state.storyMaps = removeWithId(state.storyMaps || [], storyMapId);
        });
      },
      deleteAllStoryMaps: () => set({ storyMaps: [] }),
      // Cases
      addCase: (storyMapId, caseColumn) => set((state) => {
        state.storyMaps
          .find((storyMap) => storyMap.id === storyMapId)
          ?.cases.push(caseColumn);
      }),
      updateCase: (storyMapId, { id, title, actions }) => set((state) => {
        const caseColumn = state.storyMaps
          .find((storyMap) => storyMap.id === storyMapId)
          ?.cases.find((c) => c.id === id);
        if (caseColumn) {
          if (id) caseColumn.id = id;
          if (title) caseColumn.title = title;
          if (actions) caseColumn.actions = actions;
        }
      }),
      deleteCase: (storyMapId, caseId) => set((state) => {
        const storyMap = state.storyMaps.find(
          (_storyMap) => _storyMap.id === storyMapId,
        );
        if (storyMap) storyMap.cases = removeWithId(storyMap.cases || [], caseId);
      }),
      // Actions
      addAction: (storyMapId, caseId, action) => set((state) => {
        const storyMap = state.storyMaps.find(
          (_storyMap) => _storyMap.id === storyMapId,
        );
        storyMap?.cases.find((c) => c.id === caseId)?.actions.push(action);
      }),
      updateAction: (storyMapId, { id, title, subActionGroups }) => set((state) => {
        const storyMap = state.storyMaps.find(
          (_storyMap) => _storyMap.id === storyMapId,
        );
        if (storyMap) {
          const caseAction = getAllActions(storyMap.cases).find(
            (_action) => _action.id === id,
          );
          if (caseAction && title) caseAction.title = title;
          if (caseAction && subActionGroups) caseAction.subActionGroups = subActionGroups;
        }
      }),
      deleteAction: (storyMapId, actionId) => set((state) => {
        const storyMap = state.storyMaps.find(
          (_storyMap) => _storyMap.id === storyMapId,
        );
        if (storyMap) {
          const caseAction = getAllActions(storyMap.cases).find(
            (_action) => _action.id === actionId,
          );

          if (caseAction) {
            const caseOfAction = storyMap.cases.find((_case) => _case.actions.includes(caseAction));
            if (caseOfAction) {
              caseOfAction.actions = removeWithId<Action>(
                caseOfAction.actions,
                caseAction.id,
              );
            }
          }
        }
      }),
      // SubActions
      addSubAction: (storyMapId, subActionGroupId, subAction) => set((state) => {
        const storyMap = state.storyMaps.find(
          (_storyMap) => _storyMap.id === storyMapId,
        );
        if (storyMap) {
          const subActionGroup = getAllSubActionGroups(storyMap.cases).find(
            (_subActionGroup) => _subActionGroup.id === subActionGroupId,
          );
          if (subActionGroup) subActionGroup.subActions.push(subAction);
        }
      }),
      updateSubAction: (storyMapId, { id, title }) => set((state) => {
        const storyMap = state.storyMaps.find(
          (_storyMap) => _storyMap.id === storyMapId,
        );
        if (storyMap) {
          const subAction = getAllSubActions(storyMap.cases).find(
            (_subAction) => _subAction.id === id,
          );
          if (subAction && title) subAction.title = title;
        }
      }),
      deleteSubAction: (storyMapId, subActionId) => set((state) => {
        const storyMap = state.storyMaps.find(
          (_storyMap) => _storyMap.id === storyMapId,
        );
        if (storyMap) {
          const caseSubAction = getAllSubActions(storyMap.cases).find(
            (_subAction) => _subAction.id === subActionId,
          );

          if (caseSubAction) {
            const subActionGroup = getAllSubActionGroups(storyMap.cases).find(
              (_actionGroup) => _actionGroup.subActions.includes(caseSubAction),
            );

            if (subActionGroup) {
              subActionGroup.subActions = removeWithId<SubAction>(
                subActionGroup.subActions,
                subActionId,
              );
            }
          }
        }
      }),
      // SubActionGroup
      addSubActionGroups: (storyMapId, levelId) => set((state) => {
        const storyMap = state.storyMaps.find(
          (_storyMap) => _storyMap.id === storyMapId,
        );
        if (storyMap) {
          getAllActions(storyMap.cases).forEach((action) => action.subActionGroups.push({
            id: `${SUB_ACTION_GROUP_PREFIX}-${getRndInteger()}`,
            levelId,
            subActions: [],
          }));
        }
      }),
      updateSubActionGroup: (storyMapId, { id, subActions, levelId }) => set((state) => {
        const storyMap = state.storyMaps.find(
          (_storyMap) => _storyMap.id === storyMapId,
        );
        if (storyMap) {
          const subActionGroup = getAllSubActionGroups(storyMap.cases).find(
            (_subActionGroup) => _subActionGroup.id === id,
          );
          if (subActionGroup && levelId) subActionGroup.levelId = levelId;
          if (subActionGroup && subActions) subActionGroup.subActions = subActions;
        }
      }),
      // Levels
      addLevel: (storyMapId, level) => set((state) => {
        state.storyMaps
          .find((_storyMap) => _storyMap.id === storyMapId)
          ?.levels.push(level);
      }),
      updateLevel: (storyMapId, { id, title }) => set((state) => {
        const level = state.storyMaps
          .find((_storyMap) => _storyMap.id === storyMapId)
          ?.levels.find((_level) => _level.id === id);

        if (level && title) level.title = title;
      }),
      deleteLevel: (storyMapId, levelId) => {
        set((state) => {
          const storyMap = state.storyMaps.find(
            (_storyMap) => _storyMap.id === storyMapId,
          );
          if (storyMap) storyMap.levels = removeWithId(storyMap.levels || [], levelId);
        });
      },
    })),
    {
      name: "story-map-storage",
    },
  ),
);
