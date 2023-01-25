import {
  Box,
  Center,
  Container,
  Divider,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core"
import { Issue, Sprint } from "project-extender"
import { useEffect, useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { useNavigate } from "react-router-dom"
import { useCanvasStore } from "../../lib/Store"
import { Column } from "./Column"
import { onDragEnd } from "./dndHelpers"
import { getIssues } from "./issueFetcher"
import { resizeDivider } from "./resizeDivider"
import { SprintsColumn } from "./SprintsColumn"

export function BacklogView() {
  const navigate = useNavigate()
  const projectName = useCanvasStore((state) => state.selectedProject?.name)
  const projectKey = useCanvasStore((state) => state.selectedProject?.key)
  const boardIds = useCanvasStore((state) => state.selectedProjectBoardIds)
  const [isLoading, setIsLoading] = useState(true)
  const [sprints, setSprints] = useState(new Map<string, Sprint>())
  const [columns, setColumns] = useState(
    new Map<string, { id: string; list: Issue[] }>()
  )
  const updateSprints = (key: string, value: Sprint) => {
    setSprints((map) => new Map(map.set(key, value)))
  }
  const updateColumn = (key: string, value: { id: string; list: Issue[] }) => {
    setColumns((map) => new Map(map.set(key, value)))
  }

  useEffect(() => {
    getIssues(projectKey, boardIds, updateColumn, updateSprints, setIsLoading)
  }, [])

  useEffect(() => {
    resizeDivider()
  }, [isLoading])

  return isLoading ? (
    <Center style={{ width: "100%", height: "100%" }}>
      <Loader />
    </Center>
  ) : (
    <Container sx={{ maxWidth: "100%" }}>
      <Stack
        align="left"
        sx={{
          paddingBottom: "10px",
          paddingTop: "10px",
          gap: "10px",
        }}
      >
        <Group sx={{ gap: "5px", color: "#6B778C" }}>
          <Text
            onClick={() => navigate("/projectsview")}
            sx={{
              ":hover": {
                textDecoration: "underline",
                cursor: "pointer",
              },
            }}
          >
            Projects
          </Text>
          <Text>/</Text>
          <Text>{projectName}</Text>
        </Group>
        <Title>Backlog</Title>
      </Stack>

      <Box sx={{ height: "100%", width: "100%", display: "flex" }}>
        <DragDropContext
          onDragEnd={(dropResult) =>
            onDragEnd({ ...dropResult, columns, updateColumn, sprints })
          }
        >
          <Box
            className="left-panel"
            sx={{
              padding: "5px",
              width: "50%",
              minWidth: "260px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Title size="h4">Backlog</Title>
            <Column col={columns.get("Backlog")!} />
          </Box>
          <Divider
            size="xl"
            className="resize-handle"
            orientation="vertical"
            sx={{
              cursor: "col-resize",
            }}
          />
          <Box
            className="right-panel"
            sx={{ padding: "5px", width: "50%", minWidth: "260px" }}
          >
            <SprintsColumn columns={columns} sprints={sprints} />
          </Box>
        </DragDropContext>
      </Box>
    </Container>
  )
}
