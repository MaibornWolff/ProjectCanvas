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
} from "@mantine/core";
import { Issue, StatusType } from "@canvas/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showNotification } from "@mantine/notifications";
import { AssigneeMenu } from "../DetailView/Components/AssigneeMenu";
import { Description } from "../DetailView/Components/Description";
import { IssueSummary } from "../DetailView/Components/IssueSummary";
import { Labels } from "../DetailView/Components/Labels";
import { ReporterMenu } from "../DetailView/Components/ReporterMenu";
import { DeleteIssue } from "../DetailView/Components/DeleteIssue";
import { ColorSchemeToggle } from "../common/ColorSchemeToggle";
import { IssueIcon } from "../BacklogView/Issue/IssueIcon";
import { ChildIssues } from "./Components/ChildIssues";
import { sortIssuesByRank } from "../BacklogView/helpers/backlogHelpers";
import { useCanvasStore } from "../../lib/Store";
import { issueCountAccumulator, storyPointsAccumulator } from "../common/StoryPoints/status-accumulator";
import { StoryPointsHoverCard } from "../common/StoryPoints/StoryPointsHoverCard";
import { CommentSection } from "../DetailView/Components/CommentSection";
import { getStatusTypeColor } from "../../common/status-color";
import { Attachments } from "../DetailView/Components/Attachments/Attachments";
import { IssueStatusMenu } from "../DetailView/Components/IssueStatusMenu";

export function EpicDetailView({
  issueKey,
  closeModal,
}: {
  issueKey: string,
  closeModal: () => void,
}) {
  const queryClient = useQueryClient();
  const reloadEpics = () => {
    queryClient.invalidateQueries({ queryKey: ["issues"] });
    queryClient.invalidateQueries({ queryKey: ["epics"] });
  };

  const dateFormat = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const { issueStatusByCategory, selectedProjectBoardIds: boardIds } = useCanvasStore();
  const selectedProjectKey = useCanvasStore((state) => state.selectedProject?.key);
  const currentBoardId = boardIds[0];

  const { isLoading: isLoadingChildIssues, data: childIssues } = useQuery({
    queryKey: ["issues", selectedProjectKey, currentBoardId, issueKey],
    queryFn: () => window.provider.getIssuesByProject(selectedProjectKey!, currentBoardId),
    enabled: !!selectedProjectKey,
    initialData: [],
    select: (newChildIssues) => newChildIssues
      ?.filter((issue: Issue) => issue.epic.issueKey === issueKey)
      ?.sort((issueA: Issue, issueB: Issue) => sortIssuesByRank(issueA, issueB)) ?? [],
  });

  const mutationDescription = useMutation({
    mutationFn: (issue: Partial<Issue>) => window.provider.editIssue(issue as Issue, issueKey),
    onError: () => {
      showNotification({
        message: "An error occurred while modifing the Description 😢",
        color: "red",
      });
    },
    onSuccess: () => {
      showNotification({
        message: `Description of issue ${issueKey} has been modified!`,
        color: "green",
      });
    },
  });

  const { data: issue } = useQuery({
    queryKey: ["issues", issueKey],
    queryFn: () => window.provider.getIssue(issueKey),
  });

  const getStatusNamesInCategory = (category: StatusType) => issueStatusByCategory[category]?.map((s) => s.name) ?? [];
  const validTodoStatus = getStatusNamesInCategory(StatusType.TODO);
  const validInProgressStatus = getStatusNamesInCategory(StatusType.IN_PROGRESS);
  const validDoneStatus = getStatusNamesInCategory(StatusType.DONE);

  const tasksTodo = issueCountAccumulator(childIssues, validTodoStatus);
  const tasksInProgress = issueCountAccumulator(childIssues, validInProgressStatus);
  const tasksDone = issueCountAccumulator(childIssues, validDoneStatus);
  const totalTaskCount = tasksTodo + tasksInProgress + tasksDone;

  if (isLoadingChildIssues || !issue) {
    return (<Center style={{ width: "100%", height: "100%" }}><Loader /></Center>);
  }

  return (
    <Paper p="xs">
      <Breadcrumbs mb="md">
        <Group>
          <IssueIcon type="Epic" />
          {" "}
          {issueKey}
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
            <IssueSummary summary={issue.summary} issueKey={issueKey} onMutate={reloadEpics} />
          </Title>
          <Text c="dimmed" mb="sm" size="md" style={{ marginLeft: "7px" }}>Description</Text>
          <Group style={{ marginLeft: "10px", marginTop: "-7px" }}>
            <Description
              description={issue.description}
              onChange={(newDescription) => {
                mutationDescription.mutate({ description: newDescription });
              }}
            />
          </Group>
          <Group align="center" p="sm">
            <Progress.Root
              radius="md"
              size={20}
              style={{
                width: "400px",
                marginRight: "5px",
                marginBottom: "20px",
                flexGrow: 1,
              }}
            >
              {totalTaskCount !== 0 && (
                <>
                  <Tooltip label={`${tasksDone} Done`}>
                    <Progress.Section
                      value={(tasksDone / totalTaskCount) * 100}
                      color={getStatusTypeColor(StatusType.DONE)}
                    >
                      <Progress.Label>{tasksDone}</Progress.Label>
                    </Progress.Section>
                  </Tooltip>
                  <Tooltip label={`${tasksInProgress} In progress`}>
                    <Progress.Section
                      value={(tasksInProgress / totalTaskCount) * 100}
                      color={getStatusTypeColor(StatusType.IN_PROGRESS)}
                    >
                      <Progress.Label>{tasksInProgress}</Progress.Label>
                    </Progress.Section>
                  </Tooltip>
                  <Tooltip label={`${tasksTodo} To do`}>
                    <Progress.Section
                      value={(tasksTodo / totalTaskCount) * 100}
                      color={getStatusTypeColor(StatusType.TODO)}
                    >
                      <Progress.Label>{tasksTodo}</Progress.Label>
                    </Progress.Section>
                  </Tooltip>
                </>
              )}
              {totalTaskCount === 0 && (
                <Tooltip label="Currently no child issues">
                  <Progress.Section
                    value={100}
                    color={getStatusTypeColor(StatusType.TODO)}
                  >
                    <Progress.Label>-</Progress.Label>
                  </Progress.Section>
                </Tooltip>
              )}
            </Progress.Root>
            <StoryPointsHoverCard statusType={StatusType.TODO} count={storyPointsAccumulator(childIssues, validTodoStatus)} />
            <StoryPointsHoverCard statusType={StatusType.IN_PROGRESS} count={storyPointsAccumulator(childIssues, validInProgressStatus)} />
            <StoryPointsHoverCard statusType={StatusType.DONE} count={storyPointsAccumulator(childIssues, validDoneStatus)} />
          </Group>

          <Group style={{ marginLeft: "-10px" }} grow>
            <ChildIssues issues={childIssues} />
          </Group>
        </Stack>
        <ScrollArea.Autosize style={{ minWidth: "260px", maxHeight: "70vh", flex: 10 }}>
          <Box>
            <Group justify="space-between" mb="sm">
              <IssueStatusMenu
                projectKey={issue.projectKey}
                issueKey={issueKey}
                type={issue.type}
                status={issue.status}
              />
              <DeleteIssue issueKey={issueKey} closeModal={closeModal} />
            </Group>
            <Accordion variant="contained" defaultValue="Details" mb={20}>
              <Accordion.Item value="Details">
                <Accordion.Control style={{ textAlign: "left" }}>Details</Accordion.Control>
                <Accordion.Panel>
                  <Stack>
                    <AssigneeMenu assignee={issue.assignee} issueKey={issueKey} />
                    <Group grow>
                      <Text fz="sm" c="dimmed">Labels</Text>
                      <Labels labels={issue.labels} issueKey={issueKey} onMutate={reloadEpics} />
                    </Group>
                    <ReporterMenu issueKey={issueKey} />
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <Accordion variant="contained" mb={20}>
              <Accordion.Item value="Comments">
                <Accordion.Control style={{ textAlign: "left" }}>Comments</Accordion.Control>
                <Accordion.Panel>
                  <CommentSection issueKey={issueKey} comment={issue.comment} />
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <Accordion variant="contained" mb={20}>
              <Accordion.Item value="Attachments">
                <Accordion.Control style={{ textAlign: "left" }}>Attachments</Accordion.Control>
                <Accordion.Panel>
                  <Attachments issueKey={issueKey} attachments={issue.attachments} />
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <Text size="xs" c="dimmed">{`Created ${dateFormat.format(new Date(issue.created))}`}</Text>
            <Text size="xs" c="dimmed">{`Updated ${dateFormat.format(new Date(issue.updated))}`}</Text>
          </Box>
        </ScrollArea.Autosize>
      </Group>
    </Paper>
  );
}
