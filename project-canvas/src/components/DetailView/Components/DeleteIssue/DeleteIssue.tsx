import { Button, Popover, Stack, Alert } from "@mantine/core"
import { IconAlertCircle, IconTrash } from "@tabler/icons"
import { useQueryClient } from "@tanstack/react-query"
import { deleteIssueMutation } from "./queries"

export function DeleteIssue({
  issueKey,
  closeModal,
}: {
  issueKey: string
  closeModal: () => void
}) {
  const queryClient = useQueryClient()
  const deleteIssue = deleteIssueMutation(queryClient)

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
        <Stack>
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Attention!"
            color="red"
          >
            If you delete this issue, all related subtasks will be deleted as
            well!
          </Alert>
          <Button
            onClick={() => {
              closeModal()
              deleteIssue.mutate(issueKey)
            }}
          >
            Confirm
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
