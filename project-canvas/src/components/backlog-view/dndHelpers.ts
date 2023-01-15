import { DropResult } from "react-beautiful-dnd"
import { Pbi } from "./Item"

export const onDragEnd = ({
  source,
  destination,
  columns,
  updateColumns,
}: DropResult & {
  columns: Map<string, { id: string; list: Pbi[] }>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateColumns: (t1: any, t2: any) => void
}) => {
  // Make sure we have a valid destination
  if (destination === undefined || destination === null) return null

  // Make sure we're actually moving the item
  if (
    source.droppableId === destination.droppableId &&
    destination.index === source.index
  )
    return null

  // Set start and end variables

  const start = columns.get(source.droppableId)
  const end = columns.get(destination.droppableId)

  // If start is the same as end, we're in the same column
  if (start === end) {
    // Move the item within the list
    // Start by making a new list without the dragged item
    const newList = start!.list.filter(
      (_: Pbi, idx: number) => idx !== source.index
    )

    // Then insert the item at the right location
    newList.splice(destination.index, 0, start!.list[source.index])

    // Then create a new copy of the column object
    const newCol = {
      id: start!.id,
      list: newList,
    }

    // Update the state
    // setColumns((state) => ({ ...state, [newCol.id]: newCol }))
    updateColumns(start!.id, newCol)
    return null
  }
  // If start is different from end, we need to update multiple columns
  // Filter the start list like before
  const newStartList = start!.list.filter(
    (_: Pbi, idx: number) => idx !== source.index
  )

  // Create a new start column
  const newStartCol = {
    id: start!.id,
    list: newStartList,
  }

  // Make a new end list array
  const newEndList = end!.list

  // Insert the item into the end list
  newEndList.splice(destination.index, 0, start!.list[source.index])

  // Create a new end column
  const newEndCol = {
    id: end!.id,
    list: newEndList,
  }

  // Update the state
  // setColumns((state) => ({
  //   ...state,
  //   [newStartCol.id]: newStartCol,
  //   [newEndCol.id]: newEndCol,
  // }))
  updateColumns(start!.id, newStartCol)
  updateColumns(end!.id, newEndCol)
  return null
}
