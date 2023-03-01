import { Stack } from "@mantine/core"
import { StrictModeDroppable } from "../../common/StrictModeDroppable"
import { AddCard } from "../Cards/Add/AddCard"
import { SubActionCard } from "../Cards/SubActionCard"
import { getRndInteger } from "../helpers/utils"
import { SubAction } from "../Types"

export function SubActionGroup({
  subActions,
  subActionGroupId,
  updateSubAction,
  addSubAction,
}: {
  subActions: SubAction[]
  subActionGroupId: string
  addSubAction: (actionId: string, subAction: SubAction) => void
  updateSubAction: ({ id, title }: SubAction) => void
}) {
  return (
    <StrictModeDroppable droppableId={subActionGroupId} type="subAction">
      {(provided) => (
        <Stack spacing={0} ref={provided.innerRef} {...provided.droppableProps}>
          {subActions.map((subAction, index) => (
            <SubActionCard
              key={subAction.id}
              id={subAction.id}
              index={index}
              updateSubAction={updateSubAction}
            >
              {subAction.title}
            </SubActionCard>
          ))}
          <AddCard
            id={`subAction-add-${subActionGroupId}`}
            index={subActions.length}
            onClick={() =>
              addSubAction(subActionGroupId, {
                id: `ss-${getRndInteger()}`,
                title: "New SubAction",
              })
            }
          />
          {provided.placeholder}
        </Stack>
      )}
    </StrictModeDroppable>
  )
}
