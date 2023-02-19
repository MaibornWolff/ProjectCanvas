import { Group, Stack } from "@mantine/core"
import { StrictModeDroppable } from "../common/StrictModeDroppable"
import { ActionCard } from "./Cards/ActionCard"
import { AddCard } from "./Cards/Add/AddCard"
import { CaseTitleCard } from "./Cards/CaseTitleCard"
import { getRndInteger } from "./helpers/utils"
import { Action, Case, SubActionLevel } from "./types"

export function CaseColumn({
  caseColumn,
  levels,
  updateCase,
  addAction,
  updateAction,
}: {
  caseColumn: Case
  levels: SubActionLevel[]
  updateCase: (caseColumn: Partial<Case>) => void
  addAction: (id: string, action: Action) => void
  updateAction: ({ id, title }: Action) => void
}) {
  return (
    <Stack>
      <CaseTitleCard caseColumn={caseColumn} updateCase={updateCase} />
      <StrictModeDroppable droppableId={caseColumn.id} direction="horizontal">
        {(provided) => (
          <Group
            spacing={0}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {caseColumn.actions.map((action, index) => (
              <ActionCard
                key={action.id}
                id={action.id}
                index={index}
                updateAction={updateAction}
              >
                {action.title}
              </ActionCard>
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
