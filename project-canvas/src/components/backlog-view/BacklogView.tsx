import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DragDropContext } from "react-beautiful-dnd"
import { Box, Button, Text, Container, Divider, Flex } from "@mantine/core"
import { IconChevronLeft } from "@tabler/icons"
import { Column } from "./Column"
import { Pbi } from "./Item"
import { resizeDivider } from "./resizeDivider"
import { onDragEnd } from "./dndHelpers"
import { useProjectStore } from "../projects-view/ProjectsTable"

export function BacklogView() {
  const zustandProject = useProjectStore((state) => state.selectedProject?.name)
  const navigate = useNavigate()
  const [columns, setColumns] = useState(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const updateColumn = (key: string, value: { id: string; list: Pbi[] }) => {
    setColumns((map) => new Map(map.set(key, value)))
  }

  const getPbis = async () => {
    await fetch(
      `${import.meta.env.VITE_EXTENDER}/pbis?project=${zustandProject}`
    ).then(async (result) => {
      const pbis = await result.json()
      setColumns(
        new Map([
          ["todo", { id: "todo", list: pbis }],
          ["doing", { id: "doing", list: [] }],
          ["done", { id: "done", list: [] }],
        ])
      )
      setIsLoading(false)
    })
  }

  useEffect(() => {
    getPbis()
  }, [])

  useEffect(() => {
    resizeDivider()
  }, [isLoading])

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <Container>
      <Flex align="center" gap="xl">
        <Button
          leftIcon={<IconChevronLeft />}
          onClick={() => navigate("/projectsview")}
          sx={{ flex: 1 }}
        >
          Back
        </Button>
        <Text sx={{ flex: 2 }}>project: {zustandProject}</Text>
      </Flex>
      <Box sx={{ height: "100%", width: "100%", display: "flex" }}>
        <DragDropContext
          onDragEnd={(dropResult) =>
            onDragEnd({ ...dropResult, columns, updateColumn })
          }
        >
          <Box className="left-panel" sx={{ padding: "5px", width: "50%" }}>
            <Column col={columns.get("todo")!} />
          </Box>
          <Divider
            className="resize-handle"
            size="xl"
            orientation="vertical"
            sx={{
              cursor: "col-resize",
            }}
          />
          <Box className="right-panel" sx={{ padding: "5px", width: "50%" }}>
            <Column col={columns.get("doing")!} />
            <Column col={columns.get("done")!} />
          </Box>
        </DragDropContext>
      </Box>
    </Container>
  )
}
