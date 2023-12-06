import { showNotification } from "@mantine/notifications"
import { QueryClient, useMutation } from "@tanstack/react-query"
import { Issue } from "types"
import { editIssue } from "../../helpers/queryFunctions"

export const editIssueMutation = (queryClient: QueryClient, issueKey: string) =>
  useMutation({
    mutationFn: (issue: Issue) => editIssue(issue, issueKey),
    onError: () => {
      showNotification({
        message: `The issue couldn't be modified! 😢`,
        color: "red",
      })
    },
    onSuccess: () => {
      showNotification({
        message: `The assignee for issue ${issueKey} has been modified!`,
        color: "green",
      })
      queryClient.invalidateQueries({ queryKey: ["epics"] })
      queryClient.invalidateQueries({ queryKey: ["issues"] })
    },
  })
