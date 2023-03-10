import { Button, Stack, Alert } from "@mantine/core"
import { IconAlertCircle } from "@tabler/icons"
import { useQueryClient } from "@tanstack/react-query"
import { deleteIssueMutation } from "./queries"

export function DeleteIssueAlert({
  issueKey,
  closeModal,
}: {
  issueKey: string
  closeModal: () => void
}) {
  const queryClient = useQueryClient()
  const deleteIssue = deleteIssueMutation(queryClient)

  return (
    <Stack>
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Attention!"
        color="red"
      >
        If you delete this issue, all related subtasks will be deleted as well!
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
  )
}
