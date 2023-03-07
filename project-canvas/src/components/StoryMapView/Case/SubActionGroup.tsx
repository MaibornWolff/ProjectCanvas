import { Stack } from "@mantine/core"
import { StrictModeDroppable } from "../../common/StrictModeDroppable"
import { AddCard } from "../Cards/Add/AddCard"
import { SubActionCard } from "../Cards/SubActionCard"
import { getRndInteger } from "../helpers/utils"
import { useStoryMapStore } from "../StoryMapStore"
import { SubAction } from "../Types"

export function SubActionGroup({
  subActions,
  subActionGroupId,
}: {
  subActions: SubAction[]
  subActionGroupId: string
}) {
  const addSubAction = useStoryMapStore((state) => state.addSubAction)
  const updateSubAction = useStoryMapStore((state) => state.updateSubAction)
  const deleteSubAction = useStoryMapStore((state) => state.deleteSubAction)

  return (
    <StrictModeDroppable droppableId={subActionGroupId} type="subAction">
      {(provided) => (
        <Stack spacing={0} ref={provided.innerRef} {...provided.droppableProps}>
          {subActions.map((subAction, index) => (
            <SubActionCard
              key={subAction.id}
              id={subAction.id}
              index={index}
              subAction={subAction}
              updateSubAction={updateSubAction}
              deleteSubAction={deleteSubAction}
            />
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
