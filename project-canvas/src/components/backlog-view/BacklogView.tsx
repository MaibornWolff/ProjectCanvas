import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DragDropContext } from "react-beautiful-dnd"
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Title,
  Loader,
  Center,
} from "@mantine/core"
import { IconChevronLeft } from "@tabler/icons"
import { Issue, Sprint } from "project-extender"
import { Column } from "./Column"
import { resizeDivider } from "./resizeDivider"
import { onDragEnd } from "./dndHelpers"
import { useCanvasStore } from "../../lib/Store"
import { getIssues } from "./issueFetcher"
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
    <Container>
      <Flex
        align="center"
        gap="xl"
        sx={{ paddingBottom: "10px", paddingTop: "30px" }}
      >
        <Button
          leftIcon={<IconChevronLeft />}
          onClick={() => navigate("/projectsview")}
          sx={{ flex: 1 }}
        >
          Back
        </Button>
        <Title sx={{ flex: 2 }} order={2} color="blue.7">
          project: {projectName}
        </Title>
      </Flex>
      <Divider size="xl" />
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
            className="resize-handle"
            size="xl"
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
