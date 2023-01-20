import { DropResult } from "react-beautiful-dnd"
import { Pbi } from "./Item"

export const onDragEnd = async ({
  source,
  destination,
  columns,
  updateColumn,
  sprints,
}: DropResult & {
  columns: Map<string, { id: string; list: Pbi[] }>
  updateColumn: (t1: string, t2: { id: string; list: Pbi[] }) => void
  sprints: Map<string, number>
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

  const movedPbi = start!.list[source.index]
  const destinationSprintId = sprints.get(end!.id)
  // console.log(destinationSprintId)
  // console.log(end?.id)
  // console.log(movedPbi)
  // console.log(sprints)

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

  if (destinationSprintId !== undefined) {
    await fetch(
      `${
        import.meta.env.VITE_EXTENDER
      }/moveIssueToSprint?sprint=${destinationSprintId}&issue=${
        movedPbi.pbiKey
      }`
    )
  } else if (destination.droppableId === "Unassigned") {
    await fetch(
      `${import.meta.env.VITE_EXTENDER}/moveIssueToBacklog?issue=${
        movedPbi.pbiKey
      }`
    )
  }

  return null
}
