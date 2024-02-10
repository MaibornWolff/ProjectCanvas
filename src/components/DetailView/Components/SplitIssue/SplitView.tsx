import { Dispatch, SetStateAction } from "react";
import { Group, Modal, Paper } from "@mantine/core";
import { Issue } from "../../../../../types";
import { SplitIssueDetails } from "./SplitIssueDetails";

export function SplitView({
  opened,
  setOpened,
  setCreateSplitViewOpened,
  setSelectedSplitIssues,
  selectedSplitIssues,
  issues,
  originalIssue,
}: {
  opened: boolean,
  setOpened: Dispatch<SetStateAction<boolean>>,
  setCreateSplitViewOpened: Dispatch<SetStateAction<boolean>>,
  setSelectedSplitIssues: Dispatch<SetStateAction<string[]>>,
  selectedSplitIssues: string[],
  issues: Issue[],
  originalIssue: string,
}) {
  // filtered issues for the split view screens that need to be displayed
  const filteredIssuesToDisplay = issues.filter((issue) => selectedSplitIssues.some((SplitIssue) => SplitIssue.toLowerCase().includes(issue.issueKey.toLowerCase())));

  return (
    // idea is that the modal only relies on selectedSplitIssues => gets updated in selection and delete options in CreateIssue and SelectedIssue.tsx
    // CreateIssue also updates selectedSplitIssues with the new Issue => everything controlled via selectedSplitIssue array
    <Modal
      opened={opened}
      size="auto"
      centered
      onClose={() => {
        setSelectedSplitIssues(() => [originalIssue]);
        setOpened(false);
      }}
      withCloseButton={false}
    >
      <Group style={{ alignItems: "flex-start" }}>
        <Paper withBorder>
          <SplitIssueDetails
            {...filteredIssuesToDisplay[0]}
            setCreateSplitViewOpened={setCreateSplitViewOpened}
            setSelectedSplitIssues={setSelectedSplitIssues}
            issues={issues}
            selectedSplitIssues={selectedSplitIssues}
          />
        </Paper>
        <Paper withBorder />
      </Group>
    </Modal>
  );
}
