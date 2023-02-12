import { DraggableLocation, DropResult } from "react-beautiful-dnd"
import { ItemType } from "../Cards"

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
  lists: Map<string, { type: ItemType; items: string[] }>,
  updateList: (key: string, value: { type: ItemType; items: string[] }) => void
) => {
  const { source, destination } = result

  // dropped outside the list
  if (
    !destination ||
    lists.get(source.droppableId)!.type !==
      lists.get(destination.droppableId)!.type
  ) {
    return
  }

  if (source.droppableId === destination.droppableId) {
    const items = reorder(
      lists.get(source.droppableId)!.items,
      source.index,
      destination.index
    )
    updateList(source.droppableId, {
      type: lists.get(source.droppableId)!.type,
      items,
    })
  }

  if (source.droppableId !== destination.droppableId) {
    const { newSource, newDestination } = move(
      lists.get(source.droppableId)!.items,
      lists.get(destination.droppableId)!.items,
      source,
      destination
    )
    updateList(source.droppableId, {
      type: lists.get(source.droppableId)!.type,
      items: newSource,
    })
    updateList(destination.droppableId, {
      type: lists.get(destination.droppableId)!.type,
      items: newDestination,
    })
  }
}
