import { DropResult } from "@hello-pangea/dnd";
import { Issue } from "types";
import { BacklogKey, IssuesState } from "./backlogHelpers";

export const onDragEnd = ({
  source,
  destination,
  issuesWrapper,
  updateIssuesWrapper,
}: DropResult & {
  issuesWrapper: Map<string, IssuesState>,
  updateIssuesWrapper: (key: string, newState: IssuesState) => void,
}): void => {
  if (!destination) return;
  if (
    source.droppableId === destination.droppableId
    && destination.index === source.index
  ) return;

  const startState = issuesWrapper.get(source.droppableId)!;
  const endState = issuesWrapper.get(destination.droppableId)!;
  const movedIssueKey = startState.issues[source.index].issueKey;
  const destinationSprintId = endState.sprintId;

  let newEndList;
  if (startState.sprintId === endState.sprintId) {
    newEndList = startState.issues.filter(
      (_: Issue, idx: number) => idx !== source.index,
    );
    newEndList.splice(destination.index, 0, startState.issues[source.index]);

    updateIssuesWrapper(source.droppableId, {
      ...startState,
      issues: newEndList,
    });
  } else {
    const newStartList = startState.issues.filter(
      (_: Issue, idx: number) => idx !== source.index,
    );
    newEndList = endState.issues.slice();
    newEndList.splice(destination.index, 0, startState.issues[source.index]);

    updateIssuesWrapper(source.droppableId, {
      ...startState,
      issues: newStartList,
    });
    updateIssuesWrapper(destination.droppableId, {
      ...endState,
      issues: newEndList,
    });
  }

  const keyOfIssueRankedBefore = destination.index === 0 ? "" : newEndList[destination.index - 1].issueKey;
  const keyOfIssueRankedAfter = destination.index === newEndList.length - 1
    ? ""
    : newEndList[destination.index + 1].issueKey;

  if (destinationSprintId) {
    window.provider.moveIssueToSprintAndRank(
      destinationSprintId,
      movedIssueKey,
      keyOfIssueRankedAfter,
      keyOfIssueRankedBefore,
    );
  } else if (destination.droppableId === BacklogKey) {
    window.provider.moveIssueToBacklog(movedIssueKey).then(() => {
      window.provider.rankIssueInBacklog(
        movedIssueKey,
        keyOfIssueRankedAfter,
        keyOfIssueRankedBefore,
      );
    });
  }
};
