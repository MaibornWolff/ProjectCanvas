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

export const reorder = <T>(list: T[], startIndex: number, endIndex: number) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

export const move = <T>(
  source: T[],
  destination: T[],
  droppableSource: { index: number },
  droppableDestination: { index: number }
) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  return { newSource: sourceClone, newDestination: destClone }
}

export const remove = <T>(list: T[], index: number) => {
  const result = Array.from(list)
  result.splice(index, 1)

  return result
}
