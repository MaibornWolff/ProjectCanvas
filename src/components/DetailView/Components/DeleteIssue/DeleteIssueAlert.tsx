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
    <Stack onMouseLeave={closeModal}>
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Attention!"
        color="red"
      >
        If you delete this issue, all related subtasks will be deleted as well!
      </Alert>
      <Button
        onClick={(e) => {
          e.stopPropagation()
          deleteIssue.mutate(issueKey)
          closeModal()
        }}
      >
        Confirm
      </Button>
    </Stack>
  )
}
