import { Button, Popover } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { useColorScheme } from "@canvas/common/color-scheme";
import { DeleteIssueAlert } from "./DeleteIssueAlert";

export function DeleteIssue({
  issueKey,
  closeModal,
}: {
  issueKey: string,
  closeModal: () => void,
}) {
  const colorScheme = useColorScheme();
  const [issuePopoverOpened, setIssuePopoverOpened] = useState(false);

  return (
    <Popover
      width="40vh"
      trapFocus
      position="bottom"
      withArrow
      shadow="md"
      opened={issuePopoverOpened}
    >
      <Popover.Target>
        <Button
          c="div"
          color="red"
          onClick={(e) => {
            e.stopPropagation();
            setIssuePopoverOpened(!issuePopoverOpened);
          }}
        >
          <IconTrash size={16} />
        </Button>
      </Popover.Target>
      <Popover.Dropdown
        style={(theme) => ({
          background:
            colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        })}
      >
        <DeleteIssueAlert
          issueKey={issueKey}
          cancelAlert={() => setIssuePopoverOpened(false)}
          confirmAlert={closeModal}
        />
      </Popover.Dropdown>
    </Popover>
  );
}
