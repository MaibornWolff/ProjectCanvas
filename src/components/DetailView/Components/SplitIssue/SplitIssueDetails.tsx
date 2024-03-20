import { Box, Breadcrumbs, Button, Group, Paper, ScrollArea, Stack, Text, Title, Popover } from "@mantine/core";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { Issue } from "@canvas/types";
import { isEqual } from "lodash";
import { CommentSectionAccordion } from "@canvas/components/issue-details/Comment";
import { DetailsAccordion } from "@canvas/components/issue-details/Details";
import { AttachmentsAccordion } from "@canvas/components/issue-details/Attachments";
import { EditableEpic } from "../EditableEpic";
import { IssueIcon } from "../../../BacklogView/Issue/IssueIcon";
import { IssueSummary } from "../IssueSummary";
import { Description } from "../Description";
import { Subtask } from "../SubTask";
import { AddSubtaskButton } from "../AddSubtaskButton";
import { IssueStatusMenu } from "../IssueStatusMenu";
import { SplitIssueButton } from "./SplitIssueButton";
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

  const dateFormat = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
  });

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
          <Box mb={20}>
            <DetailsAccordion
              issueKey={issueKey}
              labels={labels}
              assignee={assignee}
              sprint={sprint}
              storyPointsEstimate={storyPointsEstimate}
            />
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
          <Box mb={20}><CommentSectionAccordion issueKey={issueKey} comment={comment} /></Box>
          <Box mb={20}><AttachmentsAccordion issueKey={issueKey} attachments={attachments} /></Box>
          <Box pb="md">
            <Text size="xs" c="dimmed">{`Created ${dateFormat.format(new Date(created))}`}</Text>
            <Text size="xs" c="dimmed">{`Updated ${dateFormat.format(new Date(updated))}`}</Text>
          </Box>
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
