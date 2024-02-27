import { Accordion, Box, Breadcrumbs, Group, Paper, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { Issue } from "../../../../../types";
import { EditableEpic } from "../EditableEpic";
import { IssueIcon } from "../../../BacklogView/Issue/IssueIcon";
import { IssueSummary } from "../IssueSummary";
import { Description } from "../Description";
import { Subtask } from "../SubTask";
import { AddSubtask } from "../AddSubtask";
import { Attachments } from "../Attachments/Attachments";
import { CommentSection } from "../CommentSection";
import { IssueStatusMenu } from "../IssueStatusMenu";
import { SplitIssueButton } from "./SplitIssueButton";
import { AssigneeMenu } from "../AssigneeMenu";
import { Labels } from "../Labels";
import { IssueSprint } from "../IssueSprint";
import { StoryPointsEstimateMenu } from "../StoryPointsEstimateMenu";
import { ReporterMenu } from "../ReporterMenu";

export function SplitIssueDetails(
  {
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
    onIssueSelected,
    onIssueDescriptionChanged,
    selectedSplitIssues,
  } : Issue & {
    onIssueSelected: (issueKey: string) => void,
    onIssueDescriptionChanged: (newDescription: string) => void,
    selectedSplitIssues: string[],
  },
) {
  return (
    <Paper p="xs">
      <Breadcrumbs mb="md">
        <EditableEpic projectId={projectId} issueKey={issueKey} epic={epic} />
        <Group>
          <IssueIcon type={type} />
          {" "}
          {issueKey}
          <SplitIssueButton
            onIssueSelected={onIssueSelected}
            selectedSplitIssues={selectedSplitIssues}
          />
        </Group>
      </Breadcrumbs>
      <Stack>
        <Title order={1}>
          <IssueSummary summary={summary} issueKey={issueKey} />
        </Title>
        <ScrollArea.Autosize
          mr="xs"
          style={{ maxHeight: "70vh" }}
          offsetScrollbars
        >
          <Text c="dimmed" mb="sm">
            Description
          </Text>
          <Description
            description={description}
            onChange={onIssueDescriptionChanged}
          />
          <Group justify="left" mb="sm">
            <IssueStatusMenu
              projectId={projectId}
              issueKey={issueKey}
              type={type}
              status={status}
            />
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
          <Box pb="md">
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
    </Paper>
  );
}
