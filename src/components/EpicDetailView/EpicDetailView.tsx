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
  Tooltip,
} from "@mantine/core"
import { Attachment, Issue, User } from "types"
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
import { StoryPointsHoverCard } from "../common/StoryPoints/StoryPointsHoverCard";
import { CommentSection } from "../DetailView/Components/CommentSection";
import { StatusType } from "../../../types/status";
import { getStatusTypeColor } from "../../common/status-color"
import { Attachments } from "../DetailView/Components/Attachments/Attachments";
import { IssueStatusMenu } from "../DetailView/Components/IssueStatusMenu";

export function EpicDetailView({
  issueKey,
  summary,
  labels,
  assignee,
  description,
  created,
  updated,
  attachments,
  comment,
  status,
  closeModal,
  projectId,
  type,
}: {
  issueKey: string
  summary: string
  labels: string[]
  assignee?: User
  description: string
  created: string
  updated: string
  attachments: Attachment[]
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
  status: string
  projectId: string
  type: string
  closeModal: () => void
}) {
  const queryClient = useQueryClient()
  const reloadEpics = () => {
    queryClient.invalidateQueries({ queryKey: ["issues"] })
    queryClient.invalidateQueries({ queryKey: ["epics"] })
  };

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

  const tasksTodo = inProgressAccumulator(childIssues, StatusType.TODO)
  const tasksInProgress = inProgressAccumulator(childIssues, StatusType.IN_PROGRESS)
  const tasksDone = inProgressAccumulator(childIssues, StatusType.DONE)
  const totalTaskCount = tasksTodo + tasksInProgress + tasksDone

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
        style={{
          position: "absolute",
          top: 19,
          right: 50,
        }}
      />
      <Group align="flex-start">
        <Stack style={{ flex: 13 }} justify="flex-start">
          <Title size="h1" style={{ marginBottom: "-10px" }}>
            <IssueSummary
              summary={summary}
              issueKey={issueKey}
              onMutate={reloadEpics}
            />
          </Title>
          <Text c="dimmed" mb="sm" size="md" style={{ marginLeft: "7px" }}>
            Description
          </Text>
          <Group
            style={{
              marginLeft: "10px",
              marginTop: "-7px",
            }}
          >
            <Description issueKey={issueKey} description={description} />
          </Group>
          <Group align="center" p="sm">
            <Progress.Root
              radius="md"
              size={20}
              style={{
                width: "400px",
                marginRight: "5px",
                marginBottom: "20px",
                flexGrow: 1
              }}
            >
              <Tooltip label={`${tasksDone} Done`}>
                <Progress.Section value={(tasksDone / totalTaskCount) * 100} color={getStatusTypeColor(StatusType.DONE)}>
                  <Progress.Label>{tasksDone}</Progress.Label>
                </Progress.Section>
              </Tooltip>
              <Tooltip label={`${tasksInProgress} In progress`}>
                <Progress.Section value={(tasksInProgress / totalTaskCount) * 100} color={getStatusTypeColor(StatusType.IN_PROGRESS)}>
                  <Progress.Label>{tasksInProgress}</Progress.Label>
                </Progress.Section>
              </Tooltip>
              <Tooltip label={`${tasksTodo} To do`}>
                <Progress.Section value={(tasksTodo / totalTaskCount) * 100} color={getStatusTypeColor(StatusType.TODO)}>
                  <Progress.Label>{tasksTodo}</Progress.Label>
                </Progress.Section>
              </Tooltip>
              {totalTaskCount === 0 &&
                <Tooltip label="Currently no child issues">
                    <Progress.Section value={100} color={getStatusTypeColor(StatusType.TODO)}>
                        <Progress.Label>0</Progress.Label>
                    </Progress.Section>
                </Tooltip>}
            </Progress.Root>
            <StoryPointsHoverCard
              statusType={StatusType.TODO}
              count={storyPointsAccumulator(childIssues, StatusType.TODO)}
            />
            <StoryPointsHoverCard
              statusType={StatusType.IN_PROGRESS}
              count={storyPointsAccumulator(childIssues, StatusType.IN_PROGRESS)}
            />
            <StoryPointsHoverCard
              statusType={StatusType.DONE}
              count={storyPointsAccumulator(childIssues, StatusType.DONE)}
            />
          </Group>

          <Group style={{ marginLeft: "-10px" }} grow>
            <ChildIssues issues={childIssues} />
          </Group>
        </Stack>
        <ScrollArea.Autosize style={{ minWidth: "260px", maxHeight: "70vh", flex: 10 }}>
          <Box>
            <Group justify="space-between" mb="sm">
              <IssueStatusMenu projectId={projectId} issueKey={issueKey} type={type} status={status} />
              <DeleteIssue issueKey={issueKey} closeModal={closeModal} />
            </Group>
            <Accordion variant="contained" defaultValue="Details" mb={20}>
              <Accordion.Item value="Details">
                <Accordion.Control style={{ textAlign: "left" }}>
                  Details
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack>
                    <AssigneeMenu
                      assignee={assignee as Issue["assignee"]}
                      issueKey={issueKey}
                    />
                    <Group grow>
                      <Text fz="sm" c="dimmed">
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
                <Accordion.Control style={{ textAlign: "left" }}>
                  Comments
                </Accordion.Control>
                <Accordion.Panel>
                  <CommentSection issueKey={issueKey} comment={comment} />
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <Accordion variant="contained" mb={20}>
              <Accordion.Item value="Attachments">
                <Accordion.Control style={{ textAlign: "left" }}>
                  Attachments
                </Accordion.Control>
                <Accordion.Panel>
                  <Attachments issueKey={issueKey} attachments={attachments} />
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <Text size="xs" c="dimmed">
              Created {dateFormat.format(new Date(created))}
            </Text>
            <Text size="xs" c="dimmed">
              Updated {dateFormat.format(new Date(updated))}
            </Text>
          </Box>
        </ScrollArea.Autosize>
      </Group>
    </Paper>
  )
}
