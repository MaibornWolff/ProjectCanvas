import { Case, SubActionGroup, SubActionLevel } from "../types"

export const getRndInteger = (min = 0, max = 100000) =>
  Math.floor(Math.random() * (max - min)) + min

export const getAllActions = (cases: Case[]) =>
  cases.map((_caseColumn) => _caseColumn.actions).flat()

export const getAllSubActionGroups = (cases: Case[]) =>
  getAllActions(cases)
    .map((_action) => _action.subActionGroups)
    .flat()

export const getAllSubActions = (cases: Case[]) =>
  getAllSubActionGroups(cases)
    .map((_subActionGroup) => _subActionGroup.subActions)
    .flat()

export const getAllSubActionGroupsForLevel = (
  cases: Case[],
  level: SubActionLevel
): SubActionGroup[] =>
  getAllSubActionGroups(cases).filter(
    (_subActionGroup) => _subActionGroup.levelId === level.id
  )
