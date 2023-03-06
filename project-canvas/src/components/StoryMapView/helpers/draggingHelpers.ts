import { DropResult } from "react-beautiful-dnd"
import { Case, SubActionGroup } from "../Types"
import { getAllSubActionGroups, move, remove, reorder } from "./utils"

const CASE_PREFIX = "a"
const ACTION_PREFIX = "s"
const DELETE_COLUMN_NAME = "delete"

const isActionList = (caseId: string) =>
  caseId.match(new RegExp(`^${CASE_PREFIX}`, "g"))
const isSubActionList = (actionId: string) =>
  actionId.match(new RegExp(`^${ACTION_PREFIX}`, "g"))

export const onDragEnd = (
  result: DropResult,
  cases: Case[],
  updateCase: (caseColumn: Partial<Case>) => void,
  updateSubActionGroup: (subActionGroup: Partial<SubActionGroup>) => void
) => {
  const { source, destination } = result

  // dropped outside the list
  if (!destination) {
    return
  }

  if (
    isActionList(source.droppableId) &&
    isActionList(destination.droppableId)
  ) {
    const caseColumnSource = cases.find((c) => c.id === source.droppableId)
    const caseColumnDest = cases.find((c) => c.id === destination.droppableId)
    if (!caseColumnSource || !caseColumnDest) return

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        caseColumnSource!.actions,
        source.index,
        destination.index
      )

      updateCase({ id: caseColumnSource.id, actions: items })
    }

    if (source.droppableId !== destination.droppableId) {
      const { newSource, newDestination } = move(
        caseColumnSource!.actions,
        caseColumnDest!.actions,
        source,
        destination
      )

      updateCase({ id: caseColumnSource.id, actions: newSource })
      updateCase({ id: caseColumnDest.id, actions: newDestination })
    }
  }

  if (
    isSubActionList(source.droppableId) &&
    isSubActionList(destination.droppableId)
  ) {
    const subActionGroupSource = getAllSubActionGroups(cases).find(
      (_subActionGroup) => _subActionGroup.id === source.droppableId
    )
    const subActionGroupDest = getAllSubActionGroups(cases).find(
      (_subActionGroup) => _subActionGroup.id === destination.droppableId
    )

    if (!subActionGroupSource || !subActionGroupDest) return

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        subActionGroupSource!.subActions,
        source.index,
        destination.index
      )

      updateSubActionGroup({
        ...subActionGroupSource,
        subActions: items,
      })
    }

    if (source.droppableId !== destination.droppableId) {
      const { newSource, newDestination } = move(
        subActionGroupSource!.subActions,
        subActionGroupDest!.subActions,
        source,
        destination
      )

      updateSubActionGroup({
        ...subActionGroupSource,
        subActions: newSource,
      })
      updateSubActionGroup({
        ...subActionGroupDest,
        subActions: newDestination,
      })
    }
  }

  if (destination.droppableId === DELETE_COLUMN_NAME) {
    if (isActionList(source.droppableId)) {
      const caseColumnSource = cases.find((c) => c.id === source.droppableId)

      if (!caseColumnSource) return
      const items = remove(caseColumnSource.actions, source.index)

      updateCase({
        ...caseColumnSource,
        actions: items,
      })
    }

    if (isSubActionList(source.droppableId)) {
      const subActionGroupSource = getAllSubActionGroups(cases).find(
        (_subActionGroup) => _subActionGroup.id === source.droppableId
      )

      if (!subActionGroupSource) return
      const items = remove(subActionGroupSource.subActions, source.index)

      updateSubActionGroup({
        ...subActionGroupSource,
        subActions: items,
      })
    }
  }
}
