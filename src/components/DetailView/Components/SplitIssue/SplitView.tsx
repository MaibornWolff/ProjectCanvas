import { Dispatch, SetStateAction } from "react";
import { Group, Modal, Paper } from "@mantine/core";
import { Issue } from "../../../../../types";
import { SplitIssueDetails } from "./SplitIssueDetails";
import { SplitIssueCreate } from "./SplitIssueCreate";

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
          issueKey === "Create new Issue" ? (
            <Paper withBorder style={{ flex: 1 }}>
              <SplitIssueCreate />
            </Paper>
          ) : (
            <Paper withBorder style={{ flex: 1 }}>
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
