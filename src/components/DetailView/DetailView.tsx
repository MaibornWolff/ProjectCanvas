import { Accordion, Box, Breadcrumbs, Group, Paper, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { Issue } from "types";
import { useState } from "react";
import { AddSubtask } from "./Components/AddSubtask";
import { AssigneeMenu } from "./Components/AssigneeMenu";
import { EditableEpic } from "./Components/EditableEpic";
import { CommentSection } from "./Components/CommentSection";
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
  summary,
  status,
  storyPointsEstimate,
  epic,
  labels,
  assignee,
  description,
  subtasks,
  created,
  updated,
  comment,
  type,
  projectId,
  sprint,
  attachments,
  closeModal,
}: Issue & { closeModal: () => void }) {
  const [createSplitViewOpened, setCreateSplitViewOpened] = useState(false);
  const [selectedSplitIssues, setSelectedSplitIssues] = useState<string[]>([issueKey]);
  const addSelectedIssue = (newIssue: string) => {
    setSelectedSplitIssues((state) => [...state, newIssue]);
  };
  const replaceSelectedIssue = (oldIssue: string, newIssue: string) => {
    setSelectedSplitIssues(selectedSplitIssues.with(selectedSplitIssues.indexOf(oldIssue), newIssue));
  };

  return (
    <Paper p="xs">
      <Breadcrumbs mb="md">
        <EditableEpic projectId={projectId} issueKey={issueKey} epic={epic} />

        <Group>
          <IssueIcon type={type} />
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
            <IssueSummary summary={summary} issueKey={issueKey} />
          </Title>
          <ScrollArea.Autosize
            mr="xs"
            style={{ minWidth: "260px", maxHeight: "70vh" }}
          >
            <Text c="dimmed" mb="sm">
              Description
            </Text>
            <Description issueKey={issueKey} description={description} />
            <Text c="dimmed" mb="sm">
              Child Issues
            </Text>
            <Paper mb="lg" mr="sm">
              <Stack gap="xs">
                {subtasks.map((subtask) => (
                  <Subtask
                    key={subtask.key}
                    subtaskKey={subtask.key}
                    id={subtask.id}
                    fields={subtask.fields}
                  />
                ))}
                <AddSubtask issueKey={issueKey} projectId={projectId} />
              </Stack>
            </Paper>
            <Attachments issueKey={issueKey} attachments={attachments} />
            <CommentSection issueKey={issueKey} comment={comment} />
          </ScrollArea.Autosize>
        </Stack>
        <ScrollArea.Autosize
          style={{ minWidth: "260px", maxHeight: "70vh", flex: 10 }}
        >
          <Box>
            <Group justify="space-between" mb="sm">
              <IssueStatusMenu
                projectId={projectId}
                issueKey={issueKey}
                type={type}
                status={status}
              />

              <SplitView
                opened={createSplitViewOpened}
                onClose={() => {
                  setSelectedSplitIssues(() => [issueKey]);
                  setCreateSplitViewOpened(false);
                }}
                onCreate={(newIssueKey: string, previousNewIssueIdentifier: string) => {
                  replaceSelectedIssue(previousNewIssueIdentifier, newIssueKey);
                }}
                onIssueSelected={(selectedIssueKey: string) => {
                  setCreateSplitViewOpened(true);
                  addSelectedIssue(selectedIssueKey);
                }}
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
                      <Labels labels={labels} issueKey={issueKey} />
                    </Group>
                    <Group grow>
                      <Text fz="sm" c="dimmed">
                        Sprint
                      </Text>
                      <IssueSprint sprint={sprint} issueKey={issueKey} />
                    </Group>
                    <StoryPointsEstimateMenu
                      issueKey={issueKey}
                      storyPointsEstimate={storyPointsEstimate}
                    />
                    <ReporterMenu issueKey={issueKey} />
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <Text size="xs" c="dimmed">
              Created
              {" "}
              {new Intl.DateTimeFormat("en-GB", {
                dateStyle: "full",
                timeStyle: "short",
              }).format(new Date(created))}
            </Text>
            <Text size="xs" c="dimmed">
              Updated
              {" "}
              {new Intl.DateTimeFormat("en-GB", {
                dateStyle: "full",
                timeStyle: "short",
              }).format(new Date(updated))}
            </Text>
          </Box>
        </ScrollArea.Autosize>
      </Group>
    </Paper>
  );
}
