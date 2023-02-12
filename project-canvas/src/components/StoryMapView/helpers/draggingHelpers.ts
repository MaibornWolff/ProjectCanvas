import { DraggableLocation, DropResult } from "react-beautiful-dnd"

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

export const onDragEnd = (
  result: DropResult,
  lists: Map<string, string[]>,
  updateList: (key: string, value: string[]) => void
) => {
  const { source, destination } = result

  // dropped outside the list
  if (!destination) {
    return
  }

  if (source.droppableId === destination.droppableId) {
    const items = reorder(
      lists.get(source.droppableId)!,
      source.index,
      destination.index
    )
    updateList(source.droppableId, items)
  }

  if (source.droppableId !== destination.droppableId) {
    const { newSource, newDestination } = move(
      lists.get(source.droppableId)!,
      lists.get(destination.droppableId)!,
      source,
      destination
    )
    updateList(source.droppableId, newSource)
    updateList(destination.droppableId, newDestination)
  }
}
