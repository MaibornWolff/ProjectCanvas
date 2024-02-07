import { Dispatch, SetStateAction } from "react";
import { Modal } from "@mantine/core";
import { Issue } from "../../../../../types";

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
    />
  );
}
