import { Group, Stack } from "@mantine/core"
import { StrictModeDroppable } from "../common/StrictModeDroppable"
import { ItemCard } from "./Cards"
import { AddSubActionCard } from "./Cards/AddSubActionCard"
import { CaseTitleCard } from "./Cards/CaseTitleCard"
import { getRndInteger } from "./helpers/utils"

export interface SubAction {
  id: string
  title: string
}

export interface Action {
  id: string
  title: string
  subActions: SubAction[]
}
export interface Case {
  id: string
  title: string
  actions: Action[]
}

export function CaseColumn({
  id: caseId,
  title,
  actions,
  addAction,
}: Case & { addAction: (caseId: string, action: Action) => void }) {
  return (
    <Stack>
      <CaseTitleCard title={title} />

      <StrictModeDroppable droppableId={caseId} direction="horizontal">
        {(provided) => (
          <Group
            bg="gray.2"
            spacing={0}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {actions.map((action, index) => (
              <ItemCard
                key={action.id}
                id={`action-${action.id}`}
                index={index}
                itemType="action"
                m="10px"
              >
                {action.title}
              </ItemCard>
            ))}
            <AddSubActionCard
              onClick={() =>
                addAction(caseId, {
                  id: `s-${getRndInteger()}`,
                  title: "New Action",
                  subActions: [],
                })
              }
              id={`action-add-${caseId}`}
              index={100}
              m="10px"
            />
            {provided.placeholder}
          </Group>
        )}
      </StrictModeDroppable>
    </Stack>
  )
}
