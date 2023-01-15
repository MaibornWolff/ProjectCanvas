import { DropResult } from "react-beautiful-dnd"
import { Pbi } from "./Item"

export const onDragEnd = ({
  source,
  destination,
  columns,
  updateColumn,
}: DropResult & {
  columns: Map<string, { id: string; list: Pbi[] }>

  updateColumn: (t1: string, t2: { id: string; list: Pbi[] }) => void
}) => {
  if (destination === undefined || destination === null) return null

  if (
    source.droppableId === destination.droppableId &&
    destination.index === source.index
  )
    return null

  const start = columns.get(source.droppableId)
  const end = columns.get(destination.droppableId)

  if (start === end) {
    const newList = start!.list.filter(
      (_: Pbi, idx: number) => idx !== source.index
    )

    newList.splice(destination.index, 0, start!.list[source.index])

    const newCol = {
      id: start!.id,
      list: newList,
    }

    updateColumn(start!.id, newCol)
    return null
  }

  const newStartList = start!.list.filter(
    (_: Pbi, idx: number) => idx !== source.index
  )

  const newStartCol = {
    id: start!.id,
    list: newStartList,
  }

  const newEndList = end!.list

  newEndList.splice(destination.index, 0, start!.list[source.index])

  const newEndCol = {
    id: end!.id,
    list: newEndList,
  }

  updateColumn(start!.id, newStartCol)
  updateColumn(end!.id, newEndCol)
  return null
}
