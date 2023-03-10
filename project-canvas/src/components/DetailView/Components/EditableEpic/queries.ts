import { showNotification } from "@mantine/notifications"
import { QueryClient, useMutation } from "@tanstack/react-query"
import { Issue } from "project-extender"
import { editIssue } from "../../helpers/queryFunctions"

export const editIssueMutation = (queryClient: QueryClient, issueKey: string) =>
  useMutation({
    mutationFn: (epicKey: string) =>
      editIssue({ epic: epicKey } as Issue, issueKey),
    onError: () => {
      showNotification({
        message: `The epic couldn't be modified! 😢`,
        color: "red",
      })
    },
    onSuccess: () => {
      showNotification({
        message: `The epic for issue ${issueKey} has been modified!`,
        color: "green",
      })
      queryClient.invalidateQueries({ queryKey: ["issues"] })
    },
  })
