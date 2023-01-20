import { Box, Text } from "@mantine/core"
import { Draggable } from "react-beautiful-dnd"

export interface Pbi {
  pbiKey: string
  summary: string
  creator: string
  status: string
  index: number
  columnId: string
}

export function Item({ pbiKey, summary, index, status, columnId }: Pbi) {
  return (
    <Draggable key={pbiKey} draggableId={pbiKey} index={index}>
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
          <Text>{pbiKey}</Text>
          <Text>{columnId}</Text>
        </Box>
      )}
    </Draggable>
  )
}
