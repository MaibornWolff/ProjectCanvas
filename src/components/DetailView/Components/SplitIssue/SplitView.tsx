import { Dispatch, SetStateAction } from "react";
import { Group, Modal, Paper } from "@mantine/core";
import { Issue } from "../../../../../types";
import { SplitIssueDetails } from "./SplitIssueDetails";
import { SplitIssueCreate } from "./SplitIssueCreate";
import { CreateNewIssueKey } from "./split-view-constants";

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
  const filteredIssuesToDisplay = issues.filter((issue) => selectedSplitIssues.some((SplitIssue) => SplitIssue.toLowerCase().includes(issue.issueKey.toLowerCase())));

  return (
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
      <Group style={{ alignItems: "stretch" }}>
        {selectedSplitIssues.map((issueKey) => (
          issueKey === CreateNewIssueKey ? (
            <Paper withBorder style={{ flex: 1 }} key={issueKey}>
              <SplitIssueCreate />
            </Paper>
          ) : (
            <Paper withBorder style={{ flex: 1 }} key={issueKey}>
              <SplitIssueDetails
                {...filteredIssuesToDisplay[filteredIssuesToDisplay.findIndex((issue) => issueKey.toLowerCase().includes(issue.issueKey.toLowerCase()))]}
                setCreateSplitViewOpened={setCreateSplitViewOpened}
                setSelectedSplitIssues={setSelectedSplitIssues}
                issues={issues}
                selectedSplitIssues={selectedSplitIssues}
              />
            </Paper>
          )))}
      </Group>
    </Modal>
  );
}
