import { Dispatch, SetStateAction } from "react";
import { Modal } from "@mantine/core";
import { Issue } from "../../../../../types";

export function SplitView({
  opened,
  setOpened,
  selectedSplitIssues,
  issues,
}: {
  opened: boolean,
  setOpened: Dispatch<SetStateAction<boolean>>,
  selectedSplitIssues: string[],
  issues: Issue[],
}) {
  return (
    // idea is that the modal only relies on selectedSplitIssues => gets updated in selection and delete options in CreateIssue and SelectedIssue.tsx
    <Modal
      opened={opened}
      onClose={() => {
        setOpened(false);
      }}
    />
  );
}
