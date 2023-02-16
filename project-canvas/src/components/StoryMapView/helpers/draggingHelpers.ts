import { DraggableLocation, DropResult } from "react-beautiful-dnd"
import { Action, Case } from "../CaseColumn"

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateCaseAction: (action: Action) => void
) => {
  const { source, destination } = result

  // dropped outside the list
  if (!destination) {
    return
  }
  // action? or subAction?
  // if action
  // check if same list or not
  // get current list with id that's the same as title
  // make update with updateCase
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
    // .map((a) => a.subActions)
    // .flat()
    const caseActionDest = cases
      .map((c) => c.actions)
      .flat()
      .find((a) => a.id === destination.droppableId)
    // .map((a) => a.subActions)
    // .flat()

    if (!caseActionSource || !caseActionDest) return

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        caseActionSource!.subActions.items,
        source.index,
        destination.index
      )

      updateCaseAction({
        ...caseActionSource,
        subActions: { ...caseActionSource.subActions, items },
      })
    }

    if (source.droppableId !== destination.droppableId) {
      const { newSource, newDestination } = move(
        caseActionSource!.subActions.items,
        caseActionDest!.subActions.items,
        source,
        destination
      )

      updateCaseAction({
        ...caseActionSource,
        subActions: { ...caseActionSource.subActions, items: newSource },
      })
      updateCaseAction({
        ...caseActionDest,
        subActions: { ...caseActionDest.subActions, items: newDestination },
      })
    }
  }
}
