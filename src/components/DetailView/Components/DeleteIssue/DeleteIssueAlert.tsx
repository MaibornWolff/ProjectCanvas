import { Button, Stack, Alert } from "@mantine/core"
import { IconAlertCircle } from "@tabler/icons-react"
import { useQueryClient } from "@tanstack/react-query"
import { deleteIssueMutation } from "./queries"

export function DeleteIssueAlert({
  issueKey,
  cancelAlert,
  confirmAlert,
}: {
  issueKey: string
  cancelAlert: () => void
  confirmAlert: () => void
}) {
  const queryClient = useQueryClient()
  const deleteIssue = deleteIssueMutation(queryClient)

  return (
    <Stack onMouseLeave={cancelAlert}>
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
          confirmAlert()
        }}
      >
        Confirm
      </Button>
    </Stack>
  )
}
