import { showNotification } from "@mantine/notifications"
import { QueryClient, useMutation } from "@tanstack/react-query"
import { deleteAttachment, uploadAttachment } from "./queryFunctions"

export const addAttachmentMutation = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: ({
      issueIdOrKey,
      form,
    }: {
      issueIdOrKey: string
      form: FormData
    }) => uploadAttachment(issueIdOrKey, form),
    onError: () => {
      showNotification({
        message: `Attachment couldn't be uploaded! 😢`,
        color: "red",
      })
    },
    onSuccess: () => {
      showNotification({
        message: `New Attachment has been posted!`,
        color: "green",
      })
      queryClient.invalidateQueries({ queryKey: ["issues"] })
      queryClient.invalidateQueries({ queryKey: ["epics"] })
    },
  })

export const deleteAttachmentMutation = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: (attachmentId: string) => deleteAttachment(attachmentId),
    onError: () => {
      showNotification({
        message: `The attachment couldn't be deleted! 😢`,
        color: "red",
      })
    },
    onSuccess: () => {
      showNotification({
        message: `The attachment has been deleted!`,
        color: "green",
      })
      queryClient.removeQueries({ queryKey: ["thumbnails"] })
      queryClient.invalidateQueries({ queryKey: ["issues"] })
      queryClient.invalidateQueries({ queryKey: ["epics"] })
    },
  })
