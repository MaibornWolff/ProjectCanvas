import { DraggableLocation, DropResult } from "react-beautiful-dnd"
import { Case, SubActionGroup } from "../types"
import { getAllSubActionGroups } from "./utils"

const reorder = <T>(list: T[], startIndex: number, endIndex: number) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const move = <T>(
  source: T[],
  destination: T[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  return { newSource: sourceClone, newDestination: destClone }
}

const isActionList = (caseId: string) => caseId.match(/^a/g)
const isSubAction = (actionId: string) => actionId.match(/^s/g)

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

  if (isSubAction(source.droppableId) && isSubAction(destination.droppableId)) {
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
}
