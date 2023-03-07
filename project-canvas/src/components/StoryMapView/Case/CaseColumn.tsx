import { Group, Stack } from "@mantine/core"
import { Updater } from "use-immer"
import { StrictModeDroppable } from "../../common/StrictModeDroppable"
import { ActionCard } from "../Cards/ActionCard"
import { AddCard } from "../Cards/Add/AddCard"
import { CaseTitleCard } from "../Cards/CaseTitleCard"
import {
  addActionFn,
  deleteActionFn,
  updateActionFn,
} from "../helpers/updaterFunctions"
import { getRndInteger } from "../helpers/utils"
import { useStoryMapStore } from "../StoryMapStore"
import { Case, SubActionLevel } from "../Types"

export function CaseColumn({
  caseColumn,
  levels,
  setCases,
}: {
  caseColumn: Case
  levels: SubActionLevel[]
  setCases: Updater<Case[]>
}) {
  const updateCase = useStoryMapStore((state) => state.updateCase)
  const deleteCase = useStoryMapStore((state) => state.deleteCase)
  const addAction = addActionFn(setCases)
  const updateAction = updateActionFn(setCases)
  const deleteAction = deleteActionFn(setCases)

  return (
    <Stack>
      <CaseTitleCard
        caseColumn={caseColumn}
        updateCase={updateCase}
        deleteCase={deleteCase}
      />
      <StrictModeDroppable
        droppableId={caseColumn.id}
        direction="horizontal"
        type="action"
      >
        {(provided) => (
          <Group
            spacing={0}
            noWrap
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {caseColumn.actions.map((action, index) => (
              <ActionCard
                key={action.id}
                id={action.id}
                index={index}
                action={action}
                updateAction={updateAction}
                deleteAction={deleteAction}
              />
            ))}
            <AddCard
              id={`action-add-${caseColumn.id}`}
              index={caseColumn.actions.length}
              onClick={() =>
                addAction(caseColumn.id, {
                  id: `s-${getRndInteger()}`,
                  title: "New Action",
                  subActionGroups: levels.map((level) => ({
                    id: `sg-${getRndInteger()}`,
                    levelId: level.id,
                    subActions: [],
                  })),
                })
              }
            />
            {provided.placeholder}
          </Group>
        )}
      </StrictModeDroppable>
    </Stack>
  )
}
