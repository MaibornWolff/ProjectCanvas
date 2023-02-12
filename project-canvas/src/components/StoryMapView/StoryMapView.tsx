import { Group } from "@mantine/core"
import { useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { ItemType } from "./Cards/ItemCard"
import { CaseColumn } from "./CaseColumn"
import { onDragEnd } from "./helpers/draggingHelpers"

export function StoryMapView() {
  const [lists, setLists] = useState(
    new Map<string, { type: ItemType; items: string[] }>([
      ["list1", { type: "title", items: ["title"] }],
      ["list1-action", { type: "action", items: ["item1", "item2"] }],
      ["list1-subAction", { type: "subAction", items: ["item1-s", "item2-s"] }],
      [
        "list1-subAction2",
        { type: "subAction", items: ["item1-s2", "item2-s2"] },
      ],
      ["list2", { type: "title", items: ["title2"] }],
      ["list2-action", { type: "action", items: ["item1(2)", "item2(2)"] }],
      [
        "list2-subAction",
        { type: "subAction", items: ["item1-s(2)", "item2-s(2)"] },
      ],
      [
        "list2-subAction2",
        { type: "subAction", items: ["item1-s2(2)", "item2-s2(2)"] },
      ],
    ])
  )
  const updateList = (
    key: string,
    value: { type: ItemType; items: string[] }
  ) => {
    setLists((map) => new Map(map.set(key, value)))
  }

  return (
    <DragDropContext
      onDragEnd={(dropResult) => onDragEnd(dropResult, lists, updateList)}
    >
      <Group align="start">
        <CaseColumn
          list="list1"
          title={lists.get("list1")!.items}
          actions={lists.get("list1-action")!.items}
          subActions1={lists.get("list1-subAction")!.items}
          subActions2={lists.get("list1-subAction2")!.items}
        />

        <CaseColumn
          list="list2"
          title={lists.get("list2")!.items}
          actions={lists.get("list2-action")!.items}
          subActions1={lists.get("list2-subAction")!.items}
          subActions2={lists.get("list2-subAction2")!.items}
        />
      </Group>
    </DragDropContext>
  )
}
