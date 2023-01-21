import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DragDropContext } from "react-beautiful-dnd"
import { Box, Button, Container, Divider, Flex, Title } from "@mantine/core"
import { IconChevronLeft } from "@tabler/icons"
import { Column } from "./Column"
import { Pbi } from "./Item"
import { resizeDivider } from "./resizeDivider"
import { onDragEnd } from "./dndHelpers"
import { useProjectStore } from "../projects-view/ProjectsTable"

export function BacklogView() {
  const projectName = useProjectStore((state) => state.selectedProject?.name)
  const projectKey = useProjectStore((state) => state.selectedProject?.key)
  const navigate = useNavigate()
  const boardIds = useProjectStore((state) => state.selectedProjectBoards)
  const [isLoading, setIsLoading] = useState(true)
  const [sprints, setSprints] = useState(new Map<string, number>())
  const updateSprints = (key: string, value: number) => {
    setSprints((map) => new Map(map.set(key, value)))
  }
  const [columns, setColumns] = useState(
    new Map<string, { id: string; list: Pbi[] }>()
  )
  const updateColumn = (key: string, value: { id: string; list: Pbi[] }) => {
    setColumns((map) => new Map(map.set(key, value)))
  }

  const getPbis = async () => {
    // Fetch All Sprints to Display them
    await Promise.all(
      boardIds.map(async (boardId) => {
        const sprintsResponse = await fetch(
          `${import.meta.env.VITE_EXTENDER}/sprintsByBoardId?boardId=${boardId}`
        )
        // sprintsAsArray : Sprint[]
        const sprintsAsArray = await sprintsResponse.json()
        // sprintsArrayToMap() = transform the sprintsAsArray in this Form [SprintName , {sprintName, list : Pbis of that Sprint that are not Done}]
        await Promise.all(
          sprintsAsArray.map(
            async (sprint: { sprintId: number; sprintName: string }) => {
              updateSprints(sprint.sprintName, sprint.sprintId)
              const issuesForSprintResponse = await fetch(
                `${
                  import.meta.env.VITE_EXTENDER
                }/issuesBySprintAndProject?sprint=${
                  sprint.sprintId
                }&project=${projectKey}`
              )
              const issuesForSprints = await issuesForSprintResponse.json()
              updateColumn(sprint.sprintName, {
                id: sprint.sprintName,
                list: issuesForSprints,
              })
            }
          )
        )

        // get backlog for this boardId (unassigned pbis) and Done Pbis
        const unassignedPbisResponse = await fetch(
          `${
            import.meta.env.VITE_EXTENDER
          }/backlogIssuesByProjectAndBoard?project=${projectKey}&boardId=${boardId}`
        )
        // these are all Pbis unassigned to any sprint for the current boardId and project
        const unassignedPbis = await unassignedPbisResponse.json()
        updateColumn("Unassigned", { id: "Unassigned", list: unassignedPbis })
      })
    )

    setIsLoading(false)
  }

  useEffect(() => {
    getPbis()
  }, [])

  useEffect(() => {
    resizeDivider()
  }, [isLoading])

  const sprintsAndDone = Array.from(columns.keys())
    .filter((key) => key !== "Unassigned")
    .map((sprint) => <Column col={columns.get(sprint)!} />)

  return isLoading ? (
    <div>Loading...</div>
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
          <Box className="left-panel" sx={{ padding: "5px", width: "50%" }}>
            <Column col={columns.get("Unassigned")!} />
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
            {sprintsAndDone}
          </Box>
        </DragDropContext>
      </Box>
    </Container>
  )
}
