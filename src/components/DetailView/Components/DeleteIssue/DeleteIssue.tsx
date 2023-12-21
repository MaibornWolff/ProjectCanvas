import { Button, Popover } from "@mantine/core"
import { IconTrash } from "@tabler/icons"
import { useState } from "react";
import { DeleteIssueAlert } from "./DeleteIssueAlert"
import { useColorScheme } from "../../../../common/color-scheme";

export function DeleteIssue({
  issueKey,
  closeModal,
}: {
  issueKey: string
  closeModal: () => void
}) {
  const colorScheme = useColorScheme()
  const [issuePopoverOpened, setIssuePopoverOpened] = useState(false)

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
        <Button color="red" rightSection={<IconTrash size={16} />} onClick={(e) => {
          e.stopPropagation()
          setIssuePopoverOpened(!issuePopoverOpened)
        }}>
          Delete
        </Button>
      </Popover.Target>
      <Popover.Dropdown
        style={(theme) => ({
          background: colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        })}
      >
        <DeleteIssueAlert
          issueKey={issueKey}
          cancelAlert={() => setIssuePopoverOpened(false)}
          confirmAlert={closeModal}
        />
      </Popover.Dropdown>
    </Popover>
  )
}
