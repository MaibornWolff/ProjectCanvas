import {
  Accordion,
  Box,
  Breadcrumbs,
  Button,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
  Popover,
} from "@mantine/core";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { Issue } from "@canvas/types";
import { isEqual } from "lodash";
import { EditableEpic } from "../EditableEpic";
import { IssueIcon } from "../../../BacklogView/Issue/IssueIcon";
import { IssueSummary } from "../IssueSummary";
import { Description } from "../Description";
import { Subtask } from "../SubTask";
import { AddSubtaskButton } from "../AddSubtaskButton";
import { Attachments } from "../Attachments/Attachments";
import { CommentSection } from "../CommentSection";
import { IssueStatusMenu } from "../IssueStatusMenu";
import { SplitIssueButton } from "./SplitIssueButton";
import { AssigneeMenu } from "../AssigneeMenu";
import { Labels } from "../Labels";
import { IssueSprint } from "../IssueSprint";
import { StoryPointsEstimateMenu } from "../StoryPointsEstimateMenu";
import { ReporterMenu } from "../ReporterMenu";
import { CloseWarningAlert } from "./CloseWarningAlert";

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
    originalIssueDescription,
    subtasks,
    created,
    updated,
    comment,
    type,
    projectKey,
    sprint,
    attachments,
    onIssueSelected,
    onIssueClosed,
    onIssueSaved,
    onIssueDescriptionChanged,
    selectedSplitIssues,
  } : Issue & {
    originalIssueDescription: Issue["description"],
    onIssueSelected: (issueKey: string) => void,
    onIssueClosed: () => void,
    onIssueSaved: () => void,
    onIssueDescriptionChanged: (newDescription: Issue["description"]) => void,
    selectedSplitIssues: string[],
  },
) {
  const saveButtonDisabled = isEqual(originalIssueDescription, description);
  const [closeWarningPopoverOpened, setCloseWarningPopoverOpened] = useState(false);

  return (
    <Paper p="xs">
      <Breadcrumbs mb="md">
        <EditableEpic projectKey={projectKey} issueKey={issueKey} epic={epic} />
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
          style={{ maxHeight: "65vh" }}
          offsetScrollbars
        >
          <Text c="dimmed" mb="sm">Description</Text>
          <Description description={description} onChange={onIssueDescriptionChanged} />
          <Group justify="left" mt="sm" mb="sm">
            <IssueStatusMenu
              projectKey={projectKey}
              issueKey={issueKey}
              type={type}
              status={status}
            />
          </Group>
          <Accordion variant="contained" defaultValue="Details" mb={20}>
            <Accordion.Item value="Details">
              <Accordion.Control style={{ textAlign: "left" }}>Details</Accordion.Control>
              <Accordion.Panel>
                <Stack>
                  <AssigneeMenu assignee={assignee} issueKey={issueKey} />
                  <Group grow>
                    <Text fz="sm" c="dimmed">Labels</Text>
                    <Labels labels={labels} issueKey={issueKey} />
                  </Group>
                  <Group grow>
                    <Text fz="sm" c="dimmed">Sprint</Text>
                    <IssueSprint sprint={sprint} issueKey={issueKey} />
                  </Group>
                  <StoryPointsEstimateMenu issueKey={issueKey} storyPointsEstimate={storyPointsEstimate} />
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
          <Text c="dimmed" mb="sm">Child Issues</Text>
          <Paper mb="lg" mr="sm">
            <Stack gap="xs">
              {subtasks.map((subtask) => (
                <Subtask key={subtask.key} subtaskKey={subtask.key} fields={subtask.fields} />
              ))}
              <AddSubtaskButton issueKey={issueKey} projectKey={projectKey} />
            </Stack>
          </Paper>
          <Attachments issueKey={issueKey} attachments={attachments} />
          <CommentSection issueKey={issueKey} comment={comment} />
        </ScrollArea.Autosize>
        <Group style={{ position: "absolute", right: "50px", bottom: "15px" }}>
          <Button
            c="div"
            color="primaryBlue"
            disabled={saveButtonDisabled}
            onClick={onIssueSaved}
          >
            <IconDeviceFloppy />
          </Button>

          <Popover opened={closeWarningPopoverOpened} onChange={setCloseWarningPopoverOpened}>
            <Popover.Target>
              <Button
                c="div"
                variant="subtle"
                color="red"
                onClick={() => {
                  if (saveButtonDisabled) {
                    onIssueClosed();
                  } else {
                    setCloseWarningPopoverOpened(!closeWarningPopoverOpened);
                  }
                }}
              >
                <IconX />
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <CloseWarningAlert
                cancelAlert={() => setCloseWarningPopoverOpened(false)}
                confirmAlert={() => {
                  setCloseWarningPopoverOpened(false);
                  onIssueClosed();
                }}
              />
            </Popover.Dropdown>
          </Popover>
        </Group>
      </Stack>
    </Paper>
  );
}
