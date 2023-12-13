import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Loader,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { useNavigate } from "react-router-dom"
import { Issue } from "types"
import { useCanvasStore } from "../../../lib/Store"
import { CreateIssueModal } from "../../CreateIssue/CreateIssueModal"
import { sortIssuesByRank } from "../../BacklogView/helpers/backlogHelpers"
import { onDragEnd } from "../../BacklogView/helpers/draggingHelpers"
import { getBacklogIssues } from "../../BacklogView/helpers/queryFetchers"
import { resizeDivider } from "../../BacklogView/helpers/resizeDivider"
import { ChildIssueWrapper } from "./ChildIssueWrapper"

export function ChildIssues({ summary }: { summary: string }) {
  const navigate = useNavigate()
  const [createIssueModalOpened, setCreateIssueModalOpened] = useState(false)
  const projectKey = useCanvasStore((state) => state.selectedProject?.key)
  const boardIds = useCanvasStore((state) => state.selectedProjectBoardIds)
  const currentBoardId = boardIds[0]

  const [issuesWrappers, setIssuesWrappers] = useState(
    new Map<string, { issues: Issue[] }>()
  )
  const [searchedissuesWrappers, setSearchedissuesWrappers] = useState(
    new Map<string, { issues: Issue[] }>()
  )
  const updateIssuesWrapper = (key: string, value: { issues: Issue[] }) => {
    setIssuesWrappers((map) => new Map(map.set(key, value)))
    setSearchedissuesWrappers((map) => new Map(map.set(key, value)))
  }

  const { isLoading: isLoadingBacklogIssues, isError: isErrorBacklogIssues } =
    useQuery({
      queryKey: ["issues", projectKey, currentBoardId],
      queryFn: () => getBacklogIssues(projectKey, currentBoardId),
      enabled: !!projectKey,
      onSuccess: (backlogIssues) => {
        updateIssuesWrapper("Backlog", {
          issues:
            backlogIssues && backlogIssues instanceof Array
              ? backlogIssues
                  .filter((issue: Issue) => issue.epic === summary)
                  .sort((issueA: Issue, issueB: Issue) =>
                    sortIssuesByRank(issueA, issueB)
                  )
              : [],
        })
      },
    })

  useEffect(() => {
    resizeDivider()
  }, [isLoadingBacklogIssues])

  if (isErrorBacklogIssues)
    return (
      <Center style={{ width: "100%", height: "100%" }}>
        <Text w="300">
          An error has occurred while loading. This is due to an internal error.
          Please report this behavior to the developers. <br />
        </Text>
      </Center>
    )

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
    <Stack
      sx={{
        minHeight: "100%",
        alignItems: "center",
      }}
    >
      <Flex sx={{ flexGrow: 1 }}>
        <DragDropContext
          onDragEnd={(dropResult) =>
            onDragEnd({
              ...dropResult,
              issuesWrappers,
              updateIssuesWrapper,
            })
          }
        >
          <ScrollArea
            className="left-panel"
            p="sm"
            sx={{
              minWidth: "260px",
              height: 250,
            }}
          >
            {searchedissuesWrappers.get("Backlog") && (
              <Box mr="md">
                <ChildIssueWrapper
                  id="Backlog"
                  issues={searchedissuesWrappers.get("Backlog")!.issues}
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
                sx={(theme) => ({
                  justifyContent: "left",
                  ":hover": {
                    background:
                      theme.colorScheme === "dark"
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
          </ScrollArea>
          <Divider
            mr="xs"
            size="xl"
            sx={{
              cursor: "col-resize",
            }}
          />
        </DragDropContext>
      </Flex>
    </Stack>
  )
}
