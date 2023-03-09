import { Button, Popover } from "@mantine/core"
import { IconTrash } from "@tabler/icons"
import { DeleteIssueAlert } from "./DeleteIssueAlert"

export function DeleteIssue({
  issueKey,
  closeModal,
}: {
  issueKey: string
  closeModal: () => void
}) {
  return (
    <Popover width="40vh" trapFocus position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button color="red" rightIcon={<IconTrash size={16} />}>
          Delete
        </Button>
      </Popover.Target>
      <Popover.Dropdown
        sx={(theme) => ({
          background:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        })}
      >
        <DeleteIssueAlert issueKey={issueKey} closeModal={closeModal} />
      </Popover.Dropdown>
    </Popover>
  )
}
