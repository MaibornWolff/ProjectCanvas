import { DropResult } from "@hello-pangea/dnd"
import { Issue } from "types"
import { BacklogKey, IssuesState } from "./backlogHelpers";

export const onDragEnd = ({
  source,
  destination,
  issuesWrapper,
  updateIssuesWrapper,
}: DropResult & {
  issuesWrapper: Map<string, IssuesState>
  updateIssuesWrapper: (key: string, newState: IssuesState) => void
}): void => {
  if (!destination)
    return
  if (source.droppableId === destination.droppableId && destination.index === source.index)
    return

  const startState = issuesWrapper.get(source.droppableId)!
  const endState = issuesWrapper.get(destination.droppableId)!
  const movedIssueKey = startState.issues[source.index].issueKey
  const destinationSprintId = endState.sprintId

  if (startState.sprintId === endState.sprintId) {
    const newList = startState.issues.filter((_: Issue, idx: number) => idx !== source.index)
    newList.splice(destination.index, 0, startState.issues[source.index])

    const keyOfIssueRankedBefore =
      destination.index === 0 ? "" : newList[destination.index - 1].issueKey
    const keyOfIssueRankedAfter =
      destination.index === newList.length - 1
        ? ""
        : newList[destination.index + 1].issueKey

    if (destinationSprintId) {
      window.provider.moveIssueToSprintAndRank(
        destinationSprintId,
        movedIssueKey,
        keyOfIssueRankedAfter,
        keyOfIssueRankedBefore
      )
    } else if (destination.droppableId === "Backlog") {
      window.provider.rankIssueInBacklog(
        movedIssueKey,
        keyOfIssueRankedAfter,
        keyOfIssueRankedBefore
      )
    }

    updateIssuesWrapper(source.droppableId, { ...startState, issues: newList })

    return
  }

  const newStartIssues = startState.issues.filter((_: Issue, idx: number) => idx !== source.index)
  const newEndIssues = endState.issues.slice()
  newEndIssues.splice(destination.index, 0, startState.issues[source.index])

  updateIssuesWrapper(source.droppableId, { ...startState, issues: newStartIssues })
  updateIssuesWrapper(destination.droppableId, { ...endState, issues: newEndIssues })

  const keyOfIssueRankedBefore =
    destination.index === 0 ? "" : newEndIssues[destination.index - 1].issueKey
  const keyOfIssueRankedAfter =
    destination.index === newEndIssues.length - 1
      ? ""
      : newEndIssues[destination.index + 1].issueKey

  if (destinationSprintId) {
    window.provider.moveIssueToSprintAndRank(
      destinationSprintId,
      movedIssueKey,
      keyOfIssueRankedAfter,
      keyOfIssueRankedBefore
    )
  } else if (destination.droppableId === BacklogKey) {
    window.provider.moveIssueToBacklog(movedIssueKey).then(() => {
      window.provider.rankIssueInBacklog(
        movedIssueKey,
        keyOfIssueRankedAfter,
        keyOfIssueRankedBefore
      )
    })
  }
}
