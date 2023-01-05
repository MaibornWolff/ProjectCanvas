import { createStyles, Text } from "@mantine/core"
import { useListState } from "@mantine/hooks"
import { DragDropContext, Draggable } from "react-beautiful-dnd"
import { StrictModeDroppable } from "./StrictModeDroppable"

const useStyles = createStyles((theme) => ({
  item: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    borderRadius: theme.radius.md,
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    padding: `${theme.spacing.sm}px ${theme.spacing.xl}px`,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,
    marginBottom: theme.spacing.sm,
  },

  itemDragging: {
    boxShadow: theme.shadows.sm,
  },

  key: {
    fontSize: 30,
    fontWeight: 700,
    width: 60,
  },
}))

export interface Pbi {
  key: string
  summary: string
  creator: string
  status: string
}

export interface IssueData {
  data: Pbi[]
}

export function DndList({ data }: IssueData) {
  const { classes, cx } = useStyles()
  const [state, handlers] = useListState(data)

  const items = state.map((item, index) => (
    <Draggable key={item.key} index={index} draggableId={item.key}>
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, {
            [classes.itemDragging]: snapshot.isDragging,
          })}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Text className={classes.key}>{item.key}</Text>
          <div>
            {/* <Text>{item.name}</Text> */}
            <Text color="dimmed" size="sm">
              Status: {item.status} • Creator: {item.creator}
            </Text>
          </div>
        </div>
      )}
    </Draggable>
  ))

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) =>
        handlers.reorder({ from: source.index, to: destination?.index || 0 })
      }
    >
      <StrictModeDroppable droppableId="dnd-list" direction="vertical">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  )
}
