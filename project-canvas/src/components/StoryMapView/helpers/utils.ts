import produce from "immer"
import { Case, SubActionLevel } from "../Types"

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

export const getFilteredCasesForLevel = (
  cases: Case[],
  level: SubActionLevel
): Case[] =>
  produce(cases, (draft) => {
    draft.forEach((_case) =>
      _case.actions.forEach((_action) => {
        // eslint-disable-next-line no-param-reassign
        _action.subActionGroups = _action.subActionGroups.filter(
          (_subActionGroup) => _subActionGroup.levelId === level.id
        )
      })
    )
  })
