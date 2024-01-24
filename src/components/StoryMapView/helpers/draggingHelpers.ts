import { DropResult } from "@hello-pangea/dnd";
import { Case, SubActionGroup } from "../Types";
import {
  CASE_PREFIX,
  getAllSubActionGroups,
  move,
  reorder,
  SUB_ACTION_GROUP_PREFIX,
} from "./utils";

const isActionList = (caseId: string) =>
  caseId.match(new RegExp(`^${CASE_PREFIX}`, "g"));
const isSubActionList = (actionId: string) =>
  actionId.match(new RegExp(`^${SUB_ACTION_GROUP_PREFIX}`, "g"));

export const onDragEnd = (
  result: DropResult,
  cases: Case[],
  updateCase: (caseColumn: Partial<Case>) => void,
  updateSubActionGroup: (subActionGroup: Partial<SubActionGroup>) => void
) => {
  const { source, destination } = result;

  // dropped outside the list
  if (!destination) {
    return;
  }

  if (
    isActionList(source.droppableId) &&
    isActionList(destination.droppableId)
  ) {
    const caseColumnSource = cases.find((c) => c.id === source.droppableId);
    const caseColumnDest = cases.find((c) => c.id === destination.droppableId);
    if (!caseColumnSource || !caseColumnDest) return;

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        caseColumnSource!.actions,
        source.index,
        destination.index
      );

      updateCase({ id: caseColumnSource.id, actions: items });
    }

    if (source.droppableId !== destination.droppableId) {
      const { newSource, newDestination } = move(
        caseColumnSource!.actions,
        caseColumnDest!.actions,
        source,
        destination
      );

      updateCase({ id: caseColumnSource.id, actions: newSource });
      updateCase({ id: caseColumnDest.id, actions: newDestination });
    }
  }

  if (
    isSubActionList(source.droppableId) &&
    isSubActionList(destination.droppableId)
  ) {
    const subActionGroupSource = getAllSubActionGroups(cases).find(
      (_subActionGroup) => _subActionGroup.id === source.droppableId
    );
    const subActionGroupDest = getAllSubActionGroups(cases).find(
      (_subActionGroup) => _subActionGroup.id === destination.droppableId
    );

    if (!subActionGroupSource || !subActionGroupDest) return;

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        subActionGroupSource!.subActions,
        source.index,
        destination.index
      );

      updateSubActionGroup({
        ...subActionGroupSource,
        subActions: items,
      });
    }

    if (source.droppableId !== destination.droppableId) {
      const { newSource, newDestination } = move(
        subActionGroupSource!.subActions,
        subActionGroupDest!.subActions,
        source,
        destination
      );

      updateSubActionGroup({
        ...subActionGroupSource,
        subActions: newSource,
      });
      updateSubActionGroup({
        ...subActionGroupDest,
        subActions: newDestination,
      });
    }
  }
};
