import { DropResult } from "react-beautiful-dnd"
import { Issue, Sprint } from "project-extender"

export const onDragEnd = async ({
  source,
  destination,
  columns,
  updateColumn,
  sprints,
}: DropResult & {
  columns: Map<string, { id: string; list: Issue[] }>
  updateColumn: (t1: string, t2: { id: string; list: Issue[] }) => void
  sprints: Map<string, Sprint>
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
      (_: Issue, idx: number) => idx !== source.index
    )

    newList.splice(destination.index, 0, start!.list[source.index])

    const newCol = {
      id: start!.id,
      list: newList,
    }

    updateColumn(start!.id, newCol)
    return null
  }

  const movedIssue = start!.list[source.index]
  const destinationSprintId = sprints.get(end!.id)?.id

  const newStartList = start!.list.filter(
    (_: Issue, idx: number) => idx !== source.index
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
    await fetch(`${import.meta.env.VITE_EXTENDER}/moveIssueToSprint`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sprint: destinationSprintId,
        issue: movedIssue.issueKey,
      }),
    })
  } else if (destination.droppableId === "Backlog") {
    await fetch(`${import.meta.env.VITE_EXTENDER}/moveIssueToBacklog`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        issue: movedIssue.issueKey,
      }),
    })
  }

  return null
}
