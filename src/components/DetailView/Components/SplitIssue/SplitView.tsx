import { Group, Modal, Paper } from "@mantine/core";
import { Issue } from "../../../../../types";
import { SplitIssueDetails } from "./SplitIssueDetails";
import { SplitIssueCreate } from "./SplitIssueCreate";
import { CreateNewIssueKey } from "./split-view-constants";

export function SplitView({
  onIssueSelected,
  opened,
  onClose,
  selectedSplitIssues,
  issues,
}: {
  onIssueSelected: (issueKey: string) => void,
  opened: boolean,
  onClose: () => void,
  selectedSplitIssues: string[],
  issues: Issue[],
}) {
  const filteredIssuesToDisplay = issues.filter(
    (issue) => selectedSplitIssues.some(
      (SplitIssue) => SplitIssue.toLowerCase().includes(issue.issueKey.toLowerCase()),
    ),
  );

  return (
    <Modal
      opened={opened}
      centered
      onClose={onClose}
      withCloseButton={false}
      size="90vw"
    >
      <Group style={{ alignItems: "stretch" }}>
        {selectedSplitIssues.map((issueKey) => (
          <Paper withBorder style={{ flex: 1 }} key={issueKey}>
            {issueKey === CreateNewIssueKey ? (
              <SplitIssueCreate />
            ) : (
              <SplitIssueDetails
                {...filteredIssuesToDisplay[filteredIssuesToDisplay.findIndex((issue) => issueKey.toLowerCase().includes(issue.issueKey.toLowerCase()))]}
                onIssueSelected={onIssueSelected}
                selectedSplitIssues={selectedSplitIssues}
              />
            )}
          </Paper>
        ))}
      </Group>
    </Modal>
  );
}
