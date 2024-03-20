import {
  Accordion,
  Box,
  Breadcrumbs,
  Center,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Issue } from "types";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { showNotification } from "@mantine/notifications";
import { CommentSectionAccordion } from "@canvas/components/issue-details/Comment";
import { AddSubtaskButton } from "./Components/AddSubtaskButton";
import { AssigneeMenu } from "./Components/AssigneeMenu";
import { EditableEpic } from "./Components/EditableEpic";
import { Description } from "./Components/Description";
import { IssueSprint } from "./Components/IssueSprint";
import { IssueSummary } from "./Components/IssueSummary";
import { Labels } from "./Components/Labels";
import { ReporterMenu } from "./Components/ReporterMenu";
import { StoryPointsEstimateMenu } from "./Components/StoryPointsEstimateMenu";
import { Subtask } from "./Components/SubTask";
import { DeleteIssue } from "./Components/DeleteIssue";
import { Attachments } from "./Components/Attachments/Attachments";
import { ColorSchemeToggle } from "../common/ColorSchemeToggle";
import { IssueIcon } from "../BacklogView/Issue/IssueIcon";
import { IssueStatusMenu } from "./Components/IssueStatusMenu";
import { SplitIssueButton } from "./Components/SplitIssue/SplitIssueButton";
import { SplitView } from "./Components/SplitIssue/SplitView";

export function DetailView({
  issueKey,
  closeModal,
}: { issueKey: string, closeModal: () => void }) {
  const [createSplitViewOpened, setCreateSplitViewOpened] = useState(false);
  const [selectedSplitIssues, setSelectedSplitIssues] = useState<string[]>([issueKey]);

  function closeSplitView() {
    setSelectedSplitIssues(() => [issueKey]);
    setCreateSplitViewOpened(false);
    closeModal();
  }

  const addSelectedIssue = (newIssue: string) => {
    setSelectedSplitIssues((state) => [...state, newIssue]);
  };
  const removeSelectedIssue = (issue: string) => {
    const newSelectedSplitIssues = selectedSplitIssues.filter((x) => x !== issue);
    setSelectedSplitIssues(newSelectedSplitIssues);
    if (newSelectedSplitIssues.length === 0) {
      closeSplitView();
    }
  };
  const replaceSelectedIssue = (oldIssue: string, newIssue: string) => {
    setSelectedSplitIssues(selectedSplitIssues.with(selectedSplitIssues.indexOf(oldIssue), newIssue));
  };
  const swapSelectedIssues = (firstIssue: string, secondIssue: string) => {
    setSelectedSplitIssues(selectedSplitIssues
      .with(selectedSplitIssues.indexOf(firstIssue), secondIssue)
      .with(selectedSplitIssues.indexOf(secondIssue), firstIssue));
  };

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

  const dateFormat = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
  });

  if (!issue) {
    return <Center style={{ width: "100%", height: "100%" }}><Loader /></Center>;
  }

  return (
    <Paper p="xs">
      <Breadcrumbs mb="md">
        <EditableEpic projectKey={issue.projectKey} issueKey={issueKey} epic={issue.epic} />

        <Group>
          <IssueIcon type={issue.type} />
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
      <Group>
        <Stack style={{ flex: 13 }}>
          <Title order={1}>
            <IssueSummary summary={issue.summary} issueKey={issueKey} />
          </Title>
          <ScrollArea.Autosize mr="xs" style={{ minWidth: "260px", maxHeight: "70vh" }}>
            <Text c="dimmed" mb="sm">Description</Text>
            <Box mb="sm">
              <Description
                description={issue.description}
                onChange={(newDescription) => {
                  mutationDescription.mutate({ description: newDescription });
                }}
              />
            </Box>
            <Text c="dimmed" mb="sm">Subtasks</Text>
            <Paper mb="lg" mr="sm">
              <Stack gap="xs">
                {issue.subtasks.map((subtask) => (
                  <Subtask
                    key={subtask.key}
                    subtaskKey={subtask.key}
                    fields={subtask.fields}
                  />
                ))}
                <AddSubtaskButton issueKey={issueKey} projectKey={issue.projectKey} />
              </Stack>
            </Paper>
            <Attachments issueKey={issueKey} attachments={issue.attachments} />
          </ScrollArea.Autosize>
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

              <SplitView
                opened={createSplitViewOpened}
                onClose={() => closeSplitView()}
                onIssueClose={removeSelectedIssue}
                onCreate={(newIssueKey: string, previousNewIssueIdentifier: string) => {
                  replaceSelectedIssue(previousNewIssueIdentifier, newIssueKey);
                }}
                onIssueSelected={(selectedIssueKey: string) => {
                  setCreateSplitViewOpened(true);
                  addSelectedIssue(selectedIssueKey);
                }}
                onIssuesSwapped={swapSelectedIssues}
                selectedSplitIssues={selectedSplitIssues}
              />

              <Group>
                <SplitIssueButton
                  onIssueSelected={(selectedIssueKey: string) => {
                    setCreateSplitViewOpened(true);
                    addSelectedIssue(selectedIssueKey);
                  }}
                  selectedSplitIssues={selectedSplitIssues}
                />

                <DeleteIssue issueKey={issueKey} closeModal={closeModal} />
              </Group>
            </Group>
            <Accordion variant="contained" defaultValue="Details" mb={20}>
              <Accordion.Item value="Details">
                <Accordion.Control style={{ textAlign: "left" }}>Details</Accordion.Control>
                <Accordion.Panel>
                  <Stack>
                    <AssigneeMenu assignee={issue.assignee} issueKey={issueKey} />
                    <Group grow>
                      <Text fz="sm" c="dimmed">Labels</Text>
                      <Labels labels={issue.labels} issueKey={issueKey} />
                    </Group>
                    <Group grow>
                      <Text fz="sm" c="dimmed">Sprint</Text>
                      <IssueSprint sprint={issue.sprint} issueKey={issueKey} />
                    </Group>
                    <StoryPointsEstimateMenu issueKey={issueKey} storyPointsEstimate={issue.storyPointsEstimate} />
                    <ReporterMenu issueKey={issueKey} />
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <Box mb={20}><CommentSectionAccordion issueKey={issueKey} comment={issue.comment} initialOpen /></Box>
            <Text size="xs" c="dimmed">{`Created ${dateFormat.format(new Date(issue.created))}`}</Text>
            <Text size="xs" c="dimmed">{`Updated ${dateFormat.format(new Date(issue.updated))}`}</Text>
          </Box>
        </ScrollArea.Autosize>
      </Group>
    </Paper>
  );
}
