import { Group, Stack } from "@mantine/core"
import { StrictModeDroppable } from "../common/StrictModeDroppable"
import { ItemCard } from "./Cards"

export function CaseColumn({
  list,
  title,
  actions,
  subActions,
}: {
  list: string
  title: string[]
  actions: string[]
  subActions: string[][]
}) {
  return (
    <Stack>
      <StrictModeDroppable droppableId={list} direction="horizontal">
        {(provided) => (
          <Group
            spacing="lg"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {title.map((value, index) => (
              <ItemCard
                key={value}
                id={`${list}-title-${value}`}
                index={index}
                itemType="title"
              >
                {value}
              </ItemCard>
            ))}
            {provided.placeholder}
          </Group>
        )}
      </StrictModeDroppable>
      <StrictModeDroppable
        droppableId={`${list}-action`}
        direction="horizontal"
      >
        {(provided) => (
          <Group
            bg="gray.2"
            p="lg"
            spacing="md"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {actions.map((value, index) => (
              <ItemCard
                key={value}
                id={`${list}-action-${value}`}
                index={index}
                itemType="action"
              >
                {value}
              </ItemCard>
            ))}
            {provided.placeholder}
          </Group>
        )}
      </StrictModeDroppable>
      <Group align="start">
        <StrictModeDroppable droppableId={`${list}-subAction`}>
          {(provided) => (
            <Stack
              bg="gray.3"
              p="lg"
              spacing="md"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {subActions[0].map((value, index) => (
                <ItemCard
                  key={value}
                  id={`${list}-subAction-${value}`}
                  index={index}
                >
                  {value}
                </ItemCard>
              ))}
              {provided.placeholder}
            </Stack>
          )}
        </StrictModeDroppable>
        <StrictModeDroppable droppableId={`${list}-subAction2`}>
          {(provided) => (
            <Stack
              bg="gray.3"
              p="lg"
              spacing="md"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {subActions[1].map((value, index) => (
                <ItemCard
                  key={value}
                  id={`${list}-subAction2-${value}`}
                  index={index}
                >
                  {value}
                </ItemCard>
              ))}
              {provided.placeholder}
            </Stack>
          )}
        </StrictModeDroppable>
      </Group>
    </Stack>
  )
}
