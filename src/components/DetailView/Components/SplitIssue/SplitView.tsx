import { Dispatch, SetStateAction } from "react";
import { Button, Group, Modal, Paper } from "@mantine/core";
import { Issue } from "../../../../../types";
import { SplitIssueButton } from "./SplitIssueButton";

export function SplitView({
  opened,
  setOpened,
  selectedSplitIssues,
  issues,
  setSelectedSplitIssues,
}: {
  opened: boolean,
  setOpened: Dispatch<SetStateAction<boolean>>,
  setSelectedSplitIssues: Dispatch<SetStateAction<string[]>>,
  selectedSplitIssues: string[],
  issues: Issue[],
}) {
  // filtered issues for the split view screens that need to be displayed
  const filteredIssuesToDisplay = issues.filter((issue) => selectedSplitIssues.some((SplitIssue) => SplitIssue.toLowerCase().includes(issue.issueKey.toLowerCase())));
  return (
    // idea is that the modal only relies on selectedSplitIssues => gets updated in selection and delete options in CreateIssue and SelectedIssue.tsx
    // CreateIssue also updates selectedSplitIssues with the new Issue => everything controlled via selectedSplitIssue array
    <Modal
      opened={opened}
      size="70vw"
      centered
      onClose={() => {
        setOpened(false);
        setSelectedSplitIssues([]);
      }}
    >
      <Group>
        <Paper withBorder>
          <Button onClick={() => {
            console.log(selectedSplitIssues);
            console.log(filteredIssuesToDisplay);
          }}
          />
          <SplitIssueButton splitViewModalOpened={setOpened} setSelectedSplitIssues={setSelectedSplitIssues} issues={issues} selectedSplitIssues={selectedSplitIssues} />
        </Paper>
        <Paper withBorder>
          <SplitIssueButton splitViewModalOpened={setOpened} setSelectedSplitIssues={setSelectedSplitIssues} issues={issues} selectedSplitIssues={selectedSplitIssues} />
        </Paper>
      </Group>

    </Modal>
  );
}
