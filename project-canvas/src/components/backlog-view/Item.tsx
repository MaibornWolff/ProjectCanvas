import { Box, Text } from "@mantine/core"
import { Issue } from "project-extender"
import { Draggable } from "react-beautiful-dnd"

export function Item({ issueKey, summary, index, status, columnId }: Issue) {
  return (
    <Draggable draggableId={issueKey} index={index}>
      {(provided) => (
        <Box
          sx={{
            backgroundColor: "#eee",
            borderRadius: 4,
            padding: "4px 8px",
            transition: "background-color .8s ease-out",
            marginTop: 8,

            ":hover": {
              backgroundColor: "#fff",
              transition: "background-color .1s ease-in",
            },
          }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Text>{summary}</Text>
          <Text>{status}</Text>
          <Text>{issueKey}</Text>
          <Text>{columnId}</Text>
        </Box>
      )}
    </Draggable>
  )
}
