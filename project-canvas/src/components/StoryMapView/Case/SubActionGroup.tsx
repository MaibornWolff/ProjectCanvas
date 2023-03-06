import { Stack } from "@mantine/core"
import { Updater } from "use-immer"
import { StrictModeDroppable } from "../../common/StrictModeDroppable"
import { AddCard } from "../Cards/Add/AddCard"
import { SubActionCard } from "../Cards/SubActionCard"
import {
  addSubActionFn,
  deleteSubActionFn,
  updateSubActionFn,
} from "../helpers/updaterFunctions"
import { getRndInteger } from "../helpers/utils"
import { Case, SubAction } from "../Types"

export function SubActionGroup({
  subActions,
  subActionGroupId,
  setCases,
}: {
  subActions: SubAction[]
  subActionGroupId: string
  setCases: Updater<Case[]>
}) {
  const addSubAction = addSubActionFn(setCases)
  const updateSubAction = updateSubActionFn(setCases)
  const deleteSubAction = deleteSubActionFn(setCases)

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
