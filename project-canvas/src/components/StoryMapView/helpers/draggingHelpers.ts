import { DraggableLocation, DropResult } from "react-beautiful-dnd"
import { Case, Action } from "../types"

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

const isAction = (caseId: string) => caseId.match(/^a/g)
const isSubAction = (actionId: string) => actionId.match(/^s/g)

export const onDragEnd = (
  result: DropResult,
  cases: Case[],
  updateCase: (caseColumn: string, actions: Action[]) => void,
  updateCaseAction: (action: Action) => void
) => {
  const { source, destination } = result

  // dropped outside the list
  if (!destination) {
    return
  }

  if (isAction(source.droppableId) && isAction(destination.droppableId)) {
    const caseColumnSource = cases.find((c) => c.title === source.droppableId)
    const caseColumnDest = cases.find(
      (c) => c.title === destination.droppableId
    )
    if (!caseColumnSource || !caseColumnDest) return

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        caseColumnSource!.actions,
        source.index,
        destination.index
      )
      updateCase(caseColumnSource.title, items)
    }

    if (source.droppableId !== destination.droppableId) {
      const { newSource, newDestination } = move(
        caseColumnSource!.actions,
        caseColumnDest!.actions,
        source,
        destination
      )

      updateCase(caseColumnSource.title, newSource)
      updateCase(caseColumnDest.title, newDestination)
    }
  }

  if (isSubAction(source.droppableId) && isSubAction(destination.droppableId)) {
    const caseActionSource = cases
      .map((c) => c.actions)
      .flat()
      .find((a) => a.id === source.droppableId)

    const caseActionDest = cases
      .map((c) => c.actions)
      .flat()
      .find((a) => a.id === destination.droppableId)

    if (!caseActionSource || !caseActionDest) return

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        caseActionSource!.subActions,
        source.index,
        destination.index
      )

      updateCaseAction({
        ...caseActionSource,
        subActions: items,
      })
    }

    if (source.droppableId !== destination.droppableId) {
      const { newSource, newDestination } = move(
        caseActionSource!.subActions,
        caseActionDest!.subActions,
        source,
        destination
      )

      updateCaseAction({
        ...caseActionSource,
        subActions: newSource,
      })
      updateCaseAction({
        ...caseActionDest,
        subActions: newDestination,
      })
    }
  }
}
