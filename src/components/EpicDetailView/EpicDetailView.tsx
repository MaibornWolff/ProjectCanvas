import {
  Accordion,
  Box,
  Breadcrumbs,
  Center,
  Group,
  Loader,
  Paper,
  Progress,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core"
import { Issue, User } from "types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { AssigneeMenu } from "../DetailView/Components/AssigneeMenu"
import { Description } from "../DetailView/Components/Description"
import { IssueSummary } from "./Components/IssueSummary"
import { Labels } from "../DetailView/Components/Labels"
import { ReporterMenu } from "../DetailView/Components/ReporterMenu"
import { DeleteIssue } from "../DetailView/Components/DeleteIssue"
import { ColorSchemeToggle } from "../common/ColorSchemeToggle"
import { IssueIcon } from "../BacklogView/Issue/IssueIcon"
import { ChildIssues } from "./Components/ChildIssue/ChildIssues"
import { getIssuesByProject } from "../BacklogView/helpers/queryFetchers"
import { sortIssuesByRank } from "../BacklogView/helpers/backlogHelpers"
import { useCanvasStore } from "../../lib/Store"
import { resizeDivider } from "../BacklogView/helpers/resizeDivider"
import {
  inProgressAccumulator,
  storyPointsAccumulator,
} from "./helpers/storyPointsHelper"
import { StoryPointsHoverCard } from "./Components/StoryPointsHoverCard";
import { CommentSection } from "../DetailView/Components/CommentSection";

export function EpicDetailView({
  issueKey,
  summary,
  labels,
  assignee,
  description,
  created,
  updated,
  comment,
   closeModal,
 }: {
  issueKey: string
  summary: string
  labels: string[]
  assignee?: User
  description: string
  created: string
  updated: string
  comment: {
    comments: [
      {
        id: string
        author: User
        body: string
        created: string
        updated: string
      }
    ]
  }
  closeModal: () => void
}) {
  const queryClient = useQueryClient()
  const reloadEpics = () => queryClient.invalidateQueries({ queryKey: ["epics"] })

  const dateFormat = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
  })

  const projectKey = useCanvasStore((state) => state.selectedProject?.key)
  const boardIds = useCanvasStore((state) => state.selectedProjectBoardIds)
  const currentBoardId = boardIds[0]

  const [childIssues, setChildIssues] = useState<Issue[]>([])

  const { isLoading: isLoadingChildIssues } = useQuery({
    queryKey: ["issues", projectKey, currentBoardId, issueKey],
    queryFn: () => getIssuesByProject(projectKey, currentBoardId),
    enabled: !!projectKey,
    onSuccess: (newChildIssues) => {
      setChildIssues(
        newChildIssues
          ?.filter((issue: Issue) => issue.epic.issueKey === issueKey)
          ?.sort((issueA: Issue, issueB: Issue) => sortIssuesByRank(issueA, issueB))
            ?? [],
      )
    },
  })

  const tasksOpen = inProgressAccumulator(childIssues, "To Do")
  const tasksInProgress = inProgressAccumulator(childIssues, "In Progress")
  const tasksDone = inProgressAccumulator(childIssues, "Done")

  useEffect(() => {
    resizeDivider()
  }, [isLoadingChildIssues])

  if (isLoadingChildIssues)
    return (
      <Center style={{ width: "100%", height: "100%" }}>
        <Loader />
      </Center>
    )

  return (
    <Paper p="xs">
      <Breadcrumbs mb="md">
        <Group>
          <IssueIcon type="Epic" /> {issueKey}
        </Group>
      </Breadcrumbs>
      <ColorSchemeToggle
        size="34px"
        sx={{
          position: "absolute",
          top: 19,
          right: 50,
        }}
      />
      <Group align="flex-start">
        <Stack sx={{ flex: 13 }} justify="flex-start">
          <Title size="h1" sx={{ marginBottom: "-10px" }}>
            <IssueSummary
              summary={summary}
              issueKey={issueKey}
              onMutate={reloadEpics}
            />
          </Title>
          <Text color="dimmed" mb="sm" size="md" sx={{ marginLeft: "7px" }}>
            Description
          </Text>
          <Group
            sx={{
              marginLeft: "10px",
              marginTop: "-7px",
            }}
          >
            <Description issueKey={issueKey} description={description} />
          </Group>
          <Group align="center" p="sm">
            <Progress
              radius="md"
              size={20}
              label="hello"
              styles={{
                label: {
                  color: "black",
                  fontSize: "14px",
                  fontWeight: "normal",
                },
              }}
              sx={{
                width: "400px",
                marginRight: "5px",
                marginBottom: "20px",
                flexGrow: 1
              }}
              sections={[
                {
                  value:
                    (tasksDone / (tasksDone + tasksOpen + tasksInProgress)) *
                    100,
                  color: "#10df10",
                  label: `${tasksDone}`,
                  tooltip: `${tasksDone} Done`,
                },
                {
                  value:
                    (tasksInProgress /
                      (tasksDone + tasksOpen + tasksInProgress)) *
                    100,
                  color: "#6ba5d8",
                  label: `${tasksInProgress}`,
                  tooltip: `${tasksInProgress} In progress`,
                },
                {
                  value:
                    (tasksOpen / (tasksDone + tasksOpen + tasksInProgress)) *
                    100,
                  color: "rgb(225,223,223)",
                  label: `${tasksOpen}`,
                  tooltip: `${tasksOpen} ToDo`,
                },
                {
                  value: 100,
                  color: "rgb(225,223,223)",
                  label: `0`,
                  tooltip: "Currently no child issues",
                },
              ]}
            />
            <StoryPointsHoverCard
              statusType="To Do"
              color="gray.6"
              count={storyPointsAccumulator(childIssues, "To Do")}
            />
            <StoryPointsHoverCard
              statusType="In Progress"
              color="blue.8"
              count={storyPointsAccumulator(childIssues, "In Progress")}
            />
            <StoryPointsHoverCard
              statusType="Done"
              color="green.9"
              count={storyPointsAccumulator(childIssues, "Done")}
            />
          </Group>

          <Group sx={{ marginLeft: "-10px"}} grow>
            <ChildIssues issues={childIssues} />
          </Group>
        </Stack>
        <ScrollArea.Autosize
          maxHeight="70vh"
          sx={{ minWidth: "260px", flex: 10 }}
        >
          <Box>
            <Group position="right" mb="sm">
              <DeleteIssue issueKey={issueKey} closeModal={closeModal} />
            </Group>
            <Accordion variant="contained" defaultValue="Details" mb={20}>
              <Accordion.Item value="Details">
                <Accordion.Control sx={{ textAlign: "left" }}>
                  Details
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack>
                    <AssigneeMenu
                      assignee={assignee as Issue["assignee"]}
                      issueKey={issueKey}
                    />
                    <Group grow>
                      <Text fz="sm" color="dimmed">
                        Labels
                      </Text>
                      <Labels
                        labels={labels}
                        issueKey={issueKey}
                        onMutate={reloadEpics}
                      />
                    </Group>
                    <ReporterMenu issueKey={issueKey} />
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <Accordion variant="contained" mb={20}>
                <Accordion.Item value="Comments">
                  <Accordion.Control sx={{ textAlign: "left" }}>
                    Comments
                  </Accordion.Control>
                  <Accordion.Panel>
                    <CommentSection issueKey={issueKey} comment={comment} />
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
              <Text size="xs" color="dimmed">
              Created {dateFormat.format(new Date(created))}
            </Text>
            <Text size="xs" color="dimmed">
              Updated {dateFormat.format(new Date(updated))}
            </Text>
          </Box>
        </ScrollArea.Autosize>
      </Group>
    </Paper>
  )
}
