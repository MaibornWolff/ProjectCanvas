import { Group, Stack } from "@mantine/core"
import { useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { StrictModeDroppable } from "../common/StrictModeDroppable"
import { ItemCard } from "./Cards/ItemCard"
import { onDragEnd } from "./helpers/draggingHelpers"

export function StoryMapView() {
  const [lists, setLists] = useState(
    new Map([
      ["list1", ["item1", "item2"]],
      ["list2", ["item1(2)", "item2(2)"]],
    ])
  )
  const updateList = (key: string, value: string[]) => {
    setLists((map) => new Map(map.set(key, value)))
  }
  return (
    <DragDropContext
      onDragEnd={(dropResult) => onDragEnd(dropResult, lists, updateList)}
    >
      <Group>
        <StrictModeDroppable droppableId="list1">
          {(provided) => (
            <Stack
              spacing="lg"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {Array.from(lists.get("list1")!).map((value, index) => (
                <ItemCard key={value} id={value} index={index}>
                  {value}
                </ItemCard>
              ))}
              {provided.placeholder}
            </Stack>
          )}
        </StrictModeDroppable>
        <StrictModeDroppable droppableId="list2">
          {(provided) => (
            <Stack
              spacing="lg"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {Array.from(lists.get("list2")!).map((value, index) => (
                <ItemCard key={value} id={value} index={index}>
                  {value}
                </ItemCard>
              ))}

              {provided.placeholder}
            </Stack>
          )}
        </StrictModeDroppable>
      </Group>
    </DragDropContext>
  )
}
