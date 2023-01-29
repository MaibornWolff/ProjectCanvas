import { DropResult } from "react-beautiful-dnd"
import { Issue, Sprint } from "project-extender"

export const onDragEnd = async ({
  source,
  destination,
  issuesWrappers,
  updateIssuesWrapper,
}: DropResult & {
  issuesWrappers: Map<string, { id: string; issues: Issue[]; sprint?: Sprint }>
  updateIssuesWrapper: (
    key: string,
    value: { id: string; issues: Issue[]; sprint?: Sprint }
  ) => void
}) => {
  if (destination === undefined || destination === null) return null

  if (
    source.droppableId === destination.droppableId &&
    destination.index === source.index
  )
    return null

  const start = issuesWrappers.get(source.droppableId)!
  const end = issuesWrappers.get(destination.droppableId)!

  if (start === end) {
    const newList = start.issues.filter(
      (_: Issue, idx: number) => idx !== source.index
    )
    newList.splice(destination.index, 0, start.issues[source.index])
    updateIssuesWrapper(start.id, {
      ...start,
      issues: newList,
    })
    return null
  }

  const newStartIssues = start.issues.filter(
    (_: Issue, idx: number) => idx !== source.index
  )
  const newEndIssues = end.issues.slice()
  newEndIssues.splice(destination.index, 0, start.issues[source.index])

  updateIssuesWrapper(start.id, {
    ...start,
    issues: newStartIssues,
  })
  updateIssuesWrapper(end.id, { ...end, issues: newEndIssues })

  const movedIssueKey = start.issues[source.index].issueKey
  const destinationSprintId = end.sprint?.id
  if (destinationSprintId) {
    await fetch(`${import.meta.env.VITE_EXTENDER}/moveIssueToSprint`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sprint: destinationSprintId,
        issue: movedIssueKey,
      }),
    })
  } else if (destination.droppableId === "Backlog") {
    await fetch(`${import.meta.env.VITE_EXTENDER}/moveIssueToBacklog`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        issue: movedIssueKey,
      }),
    })
  }

  return null
}
