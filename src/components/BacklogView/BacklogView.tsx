import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import { useQueries, useQuery } from "@tanstack/react-query"
import { ChangeEvent, useEffect, useState } from "react"
import { DragDropContext } from "@hello-pangea/dnd"
import { useNavigate } from "react-router-dom"
import { Issue, Sprint } from "types"
import { useCanvasStore } from "../../lib/Store"
import { CreateIssueModal } from "../CreateIssue/CreateIssueModal"
import { CreateExportModal } from "../CreateExport/CreateExportModal"
import { CreateSprint } from "./CreateSprint/CreateSprint"
import { searchIssuesFilter, sortIssuesByRank } from "./helpers/backlogHelpers"
import { onDragEnd } from "./helpers/draggingHelpers"
import {
  getBacklogIssues,
  getIssuesBySprint,
  getSprints,
} from "./helpers/queryFetchers"
import { resizeDivider } from "./helpers/resizeDivider"
import { DraggableIssuesWrapper } from "./IssuesWrapper/DraggableIssuesWrapper"
import { SprintsPanel } from "./IssuesWrapper/SprintsPanel"
import { ReloadButton } from "./ReloadButton"
import { useColorScheme } from "../../common/color-scheme"

export function BacklogView() {
  const colorScheme = useColorScheme()
  const navigate = useNavigate()
  const [createIssueModalOpened, setCreateIssueModalOpened] = useState(false)
  const projectName = useCanvasStore((state) => state.selectedProject?.name)
  const projectKey = useCanvasStore((state) => state.selectedProject?.key)
  const boardIds = useCanvasStore((state) => state.selectedProjectBoardIds)
  const currentBoardId = boardIds[0]
  const [search, setSearch] = useState("")
  const [createExportModalOpened, setCreateExportModalOpened] = useState(false)

  const [issuesWrappers, setIssuesWrappers] = useState(
    new Map<string, { issues: Issue[]; sprint?: Sprint }>()
  )
  const [searchedissuesWrappers, setSearchedissuesWrappers] = useState(
    new Map<string, { issues: Issue[]; sprint?: Sprint }>()
  )
  const updateIssuesWrapper = (
    key: string,
    value: { issues: Issue[]; sprint?: Sprint }
  ) => {
    setIssuesWrappers((map) => new Map(map.set(key, value)))
    setSearchedissuesWrappers((map) => new Map(map.set(key, value)))
  }

  const { data: sprints, isError: isErrorSprints } = useQuery({
    queryKey: ["sprints", currentBoardId],
    queryFn: () => getSprints(currentBoardId),
    enabled: !!currentBoardId,
  })

  const sprintsIssuesResults = useQueries({
    queries:
      !isErrorSprints && sprints
        ? sprints?.map((sprint) => ({
            queryKey: ["issues", "sprints", projectKey, sprints, sprint.id],
            queryFn: () => getIssuesBySprint(sprint.id),
            enabled: !!projectKey && !!sprints,
            onSuccess: (issues: Issue[]) => {
              updateIssuesWrapper(sprint.name, {
                sprint,
                issues: issues
                  .filter(
                    (issue: Issue) =>
                      issue.type !== "Epic" && issue.type !== "Subtask"
                  )
                  .sort((issueA: Issue, issueB: Issue) =>
                    sortIssuesByRank(issueA, issueB)
                  ),
              })
              searchIssuesFilter(
                search,
                issuesWrappers,
                searchedissuesWrappers,
                setSearchedissuesWrappers
              )
            },
          }))
        : [],
  })
  const isErrorSprintsIssues = sprintsIssuesResults.some(
    ({ isError }) => isError
  )

  const { isLoading: isLoadingBacklogIssues, isError: isErrorBacklogIssues } =
    useQuery({
      queryKey: ["issues", projectKey, currentBoardId],
      queryFn: () => getBacklogIssues(projectKey, currentBoardId),
      enabled: !!projectKey,
      onSuccess: (backlogIssues) => {
        updateIssuesWrapper("Backlog", {
          sprint: undefined,
          issues:
            backlogIssues && backlogIssues instanceof Array
              ? backlogIssues
                  .filter(
                    (issue: Issue) =>
                      issue.type !== "Subtask"
                  )
                  .sort((issueA: Issue, issueB: Issue) =>
                    sortIssuesByRank(issueA, issueB)
                  )
              : [],
        })
        searchIssuesFilter(
          search,
          issuesWrappers,
          searchedissuesWrappers,
          setSearchedissuesWrappers
        )
      },
    })

  useEffect(() => {
    resizeDivider()
  }, [isLoadingBacklogIssues])

  if (isErrorSprints || isErrorBacklogIssues || isErrorSprintsIssues)
    return (
      <Center style={{ width: "100%", height: "100%" }}>
        <Text w="300">
          An error has occurred while loading. This is due to an internal error.
          Please report this behavior to the developers. <br />
          (This is a placeholder and will be replaced with better error
          messages)
        </Text>
      </Center>
    )

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const currentSearch = event.currentTarget.value
    setSearch(currentSearch)
    searchIssuesFilter(
      currentSearch,
      issuesWrappers,
      searchedissuesWrappers,
      setSearchedissuesWrappers
    )
  }

  if (isLoadingBacklogIssues)
    return (
      <Center style={{ width: "100%", height: "100%" }}>
        {projectKey ? (
          <Loader />
        ) : (
          <Stack align="center">
            <Title>No Project has been selected!</Title>
            <Text>
              Please go back to the Projects View section and select a project
            </Text>
            <Button onClick={() => navigate("/projectsview")}>Go back</Button>
          </Stack>
        )}
      </Center>
    )
  return (
    <Stack style={{ minHeight: "100%" }}>
      <Stack align="left" gap={0}>
        <Group>
          <Group gap="xs" c="dimmed">
            <Text
              onClick={() => navigate("/projectsview")}
              style={{
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
          <Button ml="auto" size="xs"
          onClick={() => setCreateExportModalOpened(true)}
          >
            Export
          </Button>
          <CreateExportModal
            opened={createExportModalOpened}
            setOpened={setCreateExportModalOpened}
          />
          <ReloadButton mr="xs" />
        </Group>
        <Title mb="sm">Backlog</Title>
        <TextInput
          placeholder="Search by issue summary, key, epic, labels, creator or assignee.."
          leftSection={<IconSearch size={14} stroke={1.5} />}
          value={search}
          onChange={handleSearchChange}
        />
      </Stack>

      <Flex style={{ flexGrow: 1 }}>
        <DragDropContext
          onDragEnd={(dropResult) =>
            onDragEnd({
              ...dropResult,
              issuesWrappers,
              updateIssuesWrapper,
            })
          }
        >
          <ScrollArea.Autosize
            className="left-panel"
            w="50%"
            p="sm"
            style={{
              maxHeight: "calc(100vh - 230px)",
              minWidth: "260px",
            }}
          >
            {searchedissuesWrappers.get("Backlog") && (
              <Box mr="xs">
                <DraggableIssuesWrapper
                  id="Backlog"
                  issues={searchedissuesWrappers.get("Backlog")!.issues.filter(issue => issue.type !== "Epic")}
                />
              </Box>
            )}
            <Box mr="xs">
              <Button
                mt="sm"
                mb="xl"
                variant="subtle"
                color="gray"
                radius="sm"
                display="flex"
                fullWidth
                onClick={() => setCreateIssueModalOpened(true)}
                style={(theme) => ({
                  justifyContent: "left",
                  ":hover": {
                    background:
                      colorScheme === "dark"
                        ? theme.colors.dark[4]
                        : theme.colors.gray[4],
                  },
                })}
              >
                + Create Issue
              </Button>
            </Box>
            <CreateIssueModal
              opened={createIssueModalOpened}
              setOpened={setCreateIssueModalOpened}
            />
          </ScrollArea.Autosize>
          <Divider
            mr="xs"
            size="xl"
            className="resize-handle"
            orientation="vertical"
            style={{
              cursor: "col-resize",
            }}
          />
          <ScrollArea.Autosize
            className="right-panel"
            w="50%"
            p="xs"
            style={{
              maxHeight: "calc(100vh - 230px)",
              minWidth: "260px",
            }}
          >
            <SprintsPanel
              sprintsWithIssues={
                Array.from(searchedissuesWrappers.values()).filter(
                  (issuesWrapper) => issuesWrapper.sprint !== undefined
                ) as unknown as {
                  issues: Issue[]
                  sprint: Sprint
                }[]
              }
            />
            <CreateSprint />
          </ScrollArea.Autosize>
        </DragDropContext>
      </Flex>
    </Stack>
  )
}
